let cube1, cube2, cube3, cube4, cube5, cube6, cube7, cube8, cube9,
    cube10, cube11, cube12, cube13, cube14, cube15, cube16, cube17,
    cube18, cube19, cube20, cube21, cube22, cube23, cube24, cube25;
    //premenné pre hierne kocky.

let cube = [cube1, cube2, cube3, cube4, cube5, cube6, cube7, cube8, cube9,
    cube10, cube11, cube12, cube13, cube14, cube15, cube16, cube17,
    cube18, cube19, cube20, cube21, cube22, cube23, cube24, cube25];
    //pole s hernými kockami

let box1, box2, box3, box4, box5; //premenné pre box.

let cubeParrent = new THREE.Object3D(); //obj, v ktorom nasádza všetky vytvorene kocky.
let boxParrent = new THREE.Object3D(); //obj, v ktorom nasádza všetky obj pre box.

let num = 0; //veľkosť poľa. Napr. Num = 2, teda rozmer pola 2x2. Maxsimalna veľkosť – 5x5.
let themeCube = 'animal';

// camera – premenná, ktorá drží objekt kamery.
// scene – premenná, ktorá drží objekt scény.
// renderer – premenná držiaca objekt rendereru.
// light – premenná, ktorá drží objekt svetitelneho zdroja
// controls – premenná, ktorá drží  OrbitControls.
// material - premenná, ktorá drží objekt materialu.
// isMouseDown - premenná držiacia informáciu o tom, či je stlačené tlačidlo myši.
// lastCall - premenná, ktorá drží čas posledného kliknutia myšou.
// keyboard - premenná, ktorá drží objekt  KeyboardState.
// clock - premenná držiacia informáciu o čase, koľko hráč hrá.
// INTERSECTED - premenná držiacia informáciu o obj, ktorý je pod myšou.
// mouse - premenná, ktorá drží polohu myši.
// projector - premenná, ktorá drží objekt projector.
let camera, scene, light, renderer, controls, material, envir, projector, INTERSECTED;
let mouse = { x: 0, y: 0 };
let clock = new THREE.Clock();
let keyboard = new THREEx.KeyboardState();
let lastCall = Date.now();
let isMouseDown = false;

init(3);
render();

function init(x, themeC) {
    //funkcia inicializuje elementárne objekty, kontrojuje správnosť vstupných parametrov a volá funkciu addObjects().
    // Vstupné parametre: x – veľkosť poľa, themeC – téma kociek.
    if (themeC !== undefined) themeCube = themeC;
    if (x === undefined) x = num;

    if (x > 5) x = 5;
    else if (x < 2) x = 2;
    num = x;

    clock.start();
    camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        0.01,
        1000);
    camera.position.set(0.06, 3.6, 13.5);
    renderer = new THREE.WebGLRenderer({ antialias: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    scene = new THREE.Scene();
    cubeParrent.remove(...cubeParrent.children);
    boxParrent.remove(...boxParrent.children);

    addObjects();


    controls = new THREE.OrbitControls(camera, renderer.domElement );
    projector = new THREE.Raycaster();
    document.addEventListener( 'mousemove', onDocumentMouseMove, false );


}

function onDocumentMouseMove( event ){
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

function render() {
    //funkcia render() zabezpečuje vykresľovanie scény v reálnom čase,
    // udalosti myši (či je stlačené tlačidlo myši) a volanie funkcie update().
    requestAnimationFrame( render );
    renderer.render( scene, camera );
    camera.lookAt(scene.position);

    document.getElementById("clock").innerHTML = timeGame(clock.getElapsedTime());
    document.body.onmousedown = function(evt) {
        if(evt.button === 0)
            isMouseDown = true;

    }
    document.body.onmouseup = function(evt) {
        if(evt.button === 0)
            isMouseDown = false;
    }

    update();


}

function timeGame(date) {
    //funkcia prevádza údaje časovača vo formu minúty/sekundy.
    // Ak hra beží viac ako hodinu vo formu hodiny/minúty/sekundy. Vstupný parameter časovač.
    let time = new Date(date * 1000);
    if(time.getHours() - 1 > 0)
        return ("0" + (time.getHours() - 1)).slice(-2) + ":" +
            ("0" + time.getMinutes()).slice(-2) + ":" + ("0" + time.getSeconds()).slice(-2);
    return ("0" + time.getMinutes()).slice(-2) + ":" + ("0" + time.getSeconds()).slice(-2);
}

function mixingCubes(array){
    //funkcia zabezpečuje náhodné premiešanie kociek. Pparametrom funkcie je poľe s kockami.
    // Vracia toto pole náhodne premiešané
    let currentIndex = array.children.length, temporaryValue, temporaryValue2, randomIndex;

    while (0 !== currentIndex) {

        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        temporaryValue = {...array.children[currentIndex].position};
        temporaryValue2 = {...array.children[randomIndex].position};

        array.children[currentIndex].position.set(temporaryValue2.x, temporaryValue2.y, temporaryValue2.z);
        array.children[randomIndex].position.set(temporaryValue.x, temporaryValue.y, temporaryValue.z);

    }

    return array;
}

function mixingFaces(array) {
    //funkcia zabezpečuje náhodné premiešanie strany kociek. Pparametrom funkcie je kocka.
    // Vracia kocku s náhodne premiešanymi stranami
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (0 !== currentIndex) {

        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function addCube(name, x, z, index){
    //funkcia zabezpečuje generovanie kociek a pridavanie ich ku cubeParrent.
    //Pparametramy funkcie: name – prenenna pre kocky, x – poloha na osi x, z - poloha na osi z.
    let geometryCube = new THREE.BoxGeometry( 1, 1, 1 );

    let loader = new THREE.TextureLoader();
    let texture1 = loader.load('texture/' + themeCube + '/' + num +'x' + num+'/1/1 (' + (index + 1) + ').jpg');
    let texture2 = loader.load('texture/' + themeCube + '/' + num +'x' + num+'/2/2 (' + (  + 1) + ').jpg');
    let texture3 = loader.load('texture/' + themeCube + '/' + num +'x' + num+'/3/3 (' + (index + 1) + ').jpg');
    let texture4 = loader.load('texture/' + themeCube + '/' + num +'x' + num+'/4/4 (' + (index + 1) + ').jpg');
    let texture5 = loader.load('texture/' + themeCube + '/' + num +'x' + num+'/5/5 (' + (index + 1) + ').jpg');
    let texture6 = loader.load('texture/' + themeCube + '/' + num +'x' + num+'/6/6 (' + (index + 1) + ').jpg');

    let materialCube = [
        new THREE.MeshBasicMaterial( {
            map: texture1,
            name: '1 (' + (index + 1) + ')'
        }),
        new THREE.MeshBasicMaterial( {
            map: texture2,
            name: '2 (' + (index + 1) + ')'
        }),
        new THREE.MeshBasicMaterial( {
            map: texture3,
            name: '3 (' + (index + 1) + ')'
        }),
        new THREE.MeshBasicMaterial( {
            map: texture4,
            name: '4 (' + (index + 1) + ')'
        }),
        new THREE.MeshBasicMaterial( {
            map: texture5,
            name: '5 (' + (index + 1) + ')'
        }),
        new THREE.MeshBasicMaterial( {
            map: texture6,
            name: '6 (' + (index + 1) + ')'
        })
    ];

    materialCube.map.minFilter = THREE.NearestFilter;
    materialCube.generateMipmaps = false;

    mixingFaces(materialCube);

    name = new THREE.Mesh( geometryCube, materialCube);
    name.position.set(x, 0, z);
    name.name = "cube" + index;
    cubeParrent.add( name );

}

function addObjects(){
    //jednoduchá funkcia, ktorá volá postupne opísané funkcie (addBox(),
    //addCube(name, x, z, index), addEnvir()), a pridáva všetko do scény.
    let x = 0, z = 0;
    cube.forEach((el, index )=> {
        if (index < num * num){
            addCube(el, x - num/2, z - num/2, index);
            if ((index + 1) % num === 0 ) {z += 1.5; x = 0; }
            else              x += 1.5;
        }
    })
    mixingCubes(cubeParrent);

    addBox();
    addEnvir();

    scene.add(light);
    scene.add(boxParrent);
    scene.add(envir);
    scene.add(cubeParrent);

}

function addEnvir(){
    //funkcia zabezpečuje generovanie okolia a svetitelneho zdroja
    let geometrySphere = new THREE.BoxGeometry( 30, 30, 30 );

    let loader = new THREE.TextureLoader();
    let texture1 = loader.load('texture/right.jpg');
    let texture2 = loader.load('texture/left.jpg');
    let texture3 = loader.load('texture/up.jpg');
    let texture4 = loader.load('texture/down.jpg');
    let texture5 = loader.load('texture/back.jpg');
    let texture6 = loader.load('texture/forward.jpg');

    let materialSphere = [
        new THREE.MeshBasicMaterial( {
            map: texture1,
            side: THREE.DoubleSide
        }),
        new THREE.MeshBasicMaterial( {
            map: texture2,
            side: THREE.DoubleSide
        }),
        new THREE.MeshBasicMaterial( {
            map: texture3,
            side: THREE.DoubleSide
        }),
        new THREE.MeshBasicMaterial( {
            map: texture4,
            side: THREE.DoubleSide
        }),
        new THREE.MeshBasicMaterial( {
            map: texture5,
            side: THREE.DoubleSide,

        }),
        new THREE.MeshBasicMaterial( {
            map: texture6,
            side: THREE.DoubleSide
            //ZOOM:  MIDDLE MOUSE
            //ORBIT: LEFT MOUSE
        })
    ];
    envir = new THREE.Mesh( geometrySphere, materialSphere );
    envir.position.set(0, 0, 0);
    envir.name = "envir";

    light = new THREE.AmbientLight( 0x404040 ); // soft white light
}

function addBox(){
    //funkcia zabezpečuje generovanie box, na ktorom nachádza kocky.
    let geometryPlane = new THREE.BoxGeometry(5 + (2 * (num - 2)), 20, 5 + (2 * (num - 2)));

    let geometryBox = new THREE.BoxGeometry(5.5 + (2 * (num - 2)), 0.5 , 0.5);
    let planeTexture = new THREE.TextureLoader().load(
        'texture/wood2.jpg' );
    let materialPlane = new THREE.MeshBasicMaterial( {
        map: planeTexture,
        transparent: true,
        side: THREE.DoubleSide} );

    let boxTexture = new THREE.TextureLoader().load(
        'texture/wood.jpg' );
    let materialBox = new THREE.MeshBasicMaterial( {
        map: boxTexture,
        transparent: true,
        side: THREE.DoubleSide} );



    box5 = new THREE.Mesh( geometryPlane, materialPlane);
    let posPlane = (num-3) * 0.25;
    box5.position.set(posPlane, -10.5, posPlane);
    box5.name = "base";

    boxParrent.add(box5);

    box1 = new THREE.Mesh( geometryBox, materialBox );
    box1.position.set(posPlane, -0.25, posPlane+num+0.5);
    boxParrent.add(box1);

    box2 = new THREE.Mesh( geometryBox, materialBox );
    box2.position.set(posPlane, -0.25, posPlane-num-0.5);
    boxParrent.add(box2);

    box3 = new THREE.Mesh( geometryBox, materialBox );
    box3.position.set(posPlane-num-0.5, -0.25, posPlane);
    box3.rotation.y = degrees_to_radians(90);
    boxParrent.add(box3);

    box4 = new THREE.Mesh( geometryBox, materialBox );
    box4.position.set(posPlane+num+0.5, -0.25, posPlane);
    box4.rotation.y = degrees_to_radians(90);
    boxParrent.add(box4);
}

function update(){
    //sleduje myš a keď je myš nad kockou, zapíše ju do premennej INTERSECTED. Potom volá funkciu handle().
    let vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
    vector.unproject( camera );
    let ray = new THREE.Raycaster( camera.position, vector.sub(camera.position ).normalize() );
    let intersects = ray.intersectObjects( cubeParrent.children );

    if ( intersects.length > 0 && INTERSECTED === null)
    {
        if ( intersects[ 0 ].object !== INTERSECTED )
            INTERSECTED = intersects[ 0 ].object;
    }

    handle();

    if (!isMouseDown) INTERSECTED = null;

    controls.update();
}

function handle() {
    //funkcia poskytuje postupné volanie move(obj) (iba pri držaní ľavého tlačidla myši),
    // rotate(obj) a odovzdá kocku ako argument funkcie. Nie viac ako raz za jeden a pol sekundy.
    let now = Date.now();
    if(now - lastCall > 150){
        if(isMouseDown && INTERSECTED !== null)
            move(INTERSECTED);

        rotate(INTERSECTED);
        lastCall = now;
    }
}

function move(obj){
    //funkcia zabezpečuje pohyb kociek v 3D scéne. Reaguje na stlačenie ľavým tlačidlom myši.
    // Dáva tiež pozor, aby kocky nešli mimo krabice. Vstupný parameter kocka.
    if (isMouseDown) {
            let vec = new THREE.Vector3(); // create once and reuse
            let pos = new THREE.Vector3(); // create once and reuse

            vec.set(mouse.x, mouse.y, 0.5);
            vec.unproject( camera );
            vec.sub( camera.position ).normalize();

            let distance = - camera.position.y / vec.y;
            pos.copy( camera.position ).add( vec.multiplyScalar( distance ) );

            obj.position.set(Math.round(pos.x*10)/10, obj.position.y, Math.round(pos.z*10)/10);

            if (obj.position.z <= - (1.25 + 0.75 * (num-1)))
                obj.position.set(obj.position.x, obj.position.y, - (1.25 + 0.75 * (num-1) ));

            if (obj.position.x <= - (1.25 + 0.75 * (num-1)))
                obj.position.set(- (1.25 + 0.75 * (num-1) ), obj.position.y, obj.position.z);

            if (obj.position.z >= 0.25 + 1.25 * (num-1))
                obj.position.set(obj.position.x, obj.position.y, 0.05 + 1.25 * (num-1) +0.2);

            if (obj.position.x >= 0.25 + 1.25 * (num-1))
                obj.position.set(0.05 + 1.25 * (num-1) +0.2, obj.position.y, obj.position.z);
        }
}

function rotate(obj){
    // rotate left/right/up/down

    if (keyboard.pressed("A"))
        obj.rotation.x += degrees_to_radians(45);
    if (keyboard.pressed("D"))
        obj.rotation.x += degrees_to_radians(-45);
    if (keyboard.pressed("W"))
        obj.rotation.y += degrees_to_radians(45);
    if (keyboard.pressed("S"))
        obj.rotation.y += degrees_to_radians(-45);
}

function degrees_to_radians(degrees){
    let pi = Math.PI;
    return degrees * (pi/180);
}