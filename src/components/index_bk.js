import React, { Component } from "react";
import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {OBJLoader} from "three/examples/jsm/loaders/OBJLoader";
import {OBJLoader2} from "three/examples/jsm/loaders/OBJLoader2";
import {OBJLoader2Parallel} from "three/examples/jsm/loaders/OBJLoader2Parallel";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      img: "https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      text: "Taylor's Uni", 
    };
  }

  onDocumentMouseClick(event) {
    mouse.x = -10000000;
    mouse.y =-10000000;
  }

  onDocumentMouseDown(event) {
      
      event.preventDefault();
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    console.log(mouse.x)
  }

  onmousemove(event) {
    mouse.x = -10000000;
    mouse.y = -10000000;
  }

    componentDidMount() {
        this.sceneSetup();
        this.addCustomSceneObjects();
        this.startAnimationLoop();

        // window.addEventListener('click', function(){
        //   console.log('click');
        // });

        window.addEventListener('mouseup', this.onDocumentMouseClick, false);
        window.addEventListener('mousedown', this.onDocumentMouseDown, false);
        window.addEventListener('mousemove', this.onmousemove, false);
        window.addEventListener('resize', this.handleWindowResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleWindowResize);
        window.cancelAnimationFrame(this.requestID);
        this.controls.dispose();
    }

    // Standard scene setup in Three.js. Check "Creating a scene" manual for more information
    // https://threejs.org/docs/#manual/en/introduction/Creating-a-scene
    sceneSetup = () => {
        // get container dimensions and use them for scene sizing
        const width = this.mount.clientWidth;
        const height = this.mount.clientHeight;

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            75, // fov = field of view
            width / height, // aspect ratio
            0.1, // near plane
            1000 // far plane
        );
        // this.camera.position.z = 19; 
        this.camera.position.set(-40,40,100);
        // is used here to set some distance from a cube that is located at z = 0
        // OrbitControls allow a camera to orbit around the object
        // https://threejs.org/docs/#examples/controls/OrbitControls
        this.controls = new OrbitControls( this.camera, this.mount );
        
        this.renderer = new THREE.WebGLRenderer({ alpha: true });
        this.renderer.setClearColor( 0xffffff, 0);
        this.renderer.setSize( width, height );
        this.mount.appendChild( this.renderer.domElement ); // mount using React ref
    };

    onLoad = ( gltf, position ) => {
      gltf.scene.children[ 0 ].images = [
        {
          "uuid": "DB9E16B2-229F-4C5D-81A7-C60F84F2BC10",
          "url": "https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
        }
      ]

      console.log(gltf.scene.children[ 0 ])

      const model = gltf.scene.children[ 0 ];
      model.position.copy( position );
  
      const animation = gltf.animations[ 0 ];
      const mixer = new THREE.AnimationMixer( model );
  
      // we'll check every object in the scene for
      // this function and call it once per frame
      model.userData.onUpdate = ( delta ) => {
        mixer.update( delta );
      };
  
      const action = mixer.clipAction( animation );
      action.play();
  
      this.scene.add( model );
  
    };

    renderCubeText = () => {
      var canvas = document.createElement("canvas");
			var context = canvas.getContext("2d");
			
			var x = canvas.width / 2;
			var y = canvas.height / 2;
			context.font = "30pt Calibri";
			context.textAlign = "center";
			context.fillRect(0,0,600,600);
			context.fillStyle = "yellow";
      context.fillText( this.state.text, x, y);
      let strDataURI = canvas.toDataURL("image/jpeg");
			let imag = new Image();
      imag.src = strDataURI;
      var cubeMaterials = new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( imag.src ) } );

      const geometry = new THREE.BoxGeometry(0, 20, 50);
      let img = this.state.img
      // "https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500";
      // let cubeMaterials = [ 
      //   new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( img ), opacity:0.8, side: THREE.DoubleSide}),
      //   new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( img ), opacity:0.8, side: THREE.DoubleSide}), 
      //   new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( img ), opacity:0.8, side: THREE.DoubleSide}),
      //   new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( img ), opacity:0.8, side: THREE.DoubleSide}), 
      //   new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( img ), opacity:0.8, side: THREE.DoubleSide}), 
      //   new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( img ), opacity:0.8, side: THREE.DoubleSide}), 
      // ]; 

      let material = new THREE.MeshFaceMaterial( cubeMaterials );
      this.cube = new THREE.Mesh( geometry, material );
      
      // this.cube.position.x = 105;
      // this.cube.position.z = 15;
      this.cube.position.y = 50;

      // this.cube.rotation.x = 0.00;
      this.cube.rotation.y = 1.2;
      this.cube.rotation.z = -0.3;
      this.scene.add( this.cube );
      
      this.cube.cursor = 'pointer';
      this.cube.addEventListener( 'click',function(){
        // cubeScale()
        console.log('click');
      } , false );

      // this.cube.on('click', function(ev) {
      //   console.log('click');
      // });
    }

    renderCubeImg = () => {
      const geometry = new THREE.BoxGeometry(5, 0, 10);
      let img = "https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500";
      let cubeMaterials = [ 
        new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( img ), opacity:0.8, side: THREE.DoubleSide}),
        new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( img ), opacity:0.8, side: THREE.DoubleSide}), 
        new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( img ), opacity:0.8, side: THREE.DoubleSide}),
        new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( img ), opacity:0.8, side: THREE.DoubleSide}), 
        new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( img ), opacity:0.8, side: THREE.DoubleSide}), 
        new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( img ), opacity:0.8, side: THREE.DoubleSide}), 
      ]; 

      let material = new THREE.MeshFaceMaterial( cubeMaterials );
      this.cube = new THREE.Mesh( geometry, material );
      
      this.cube.position.z = 65;
      this.cube.position.y = 6.5;
      this.scene.add( this.cube );
    }

    addCustomSceneObjects = () => {
      
      // this.loader = new OBJLoader();
      // this.loader = new OBJLoader2();
      // this.loader = new OBJLoader2Parallel();
        this.loader = new GLTFLoader();
        const parrotPosition = new THREE.Vector3( 0, 0, 50 );
        const onError = ( errorMessage ) => { console.log( errorMessage ); };
        this.loader.load( 
          // require('./scene.json'), 
          'https://threejs.org/examples/models/gltf/Parrot.glb', 
          gltf => this.onLoad( gltf, parrotPosition ), null, onError );      

      // )
      // this.loader.load(
      //   require('./scene.json'), 
      //   // 'https://threejs.org/examples/models/gltf/Parrot.glb',

      //   function( object ){
      //     console.log(object)
      //     this.scene.add(object);
      //   }
      // );

        this.renderCubeText()
        this.renderCubeImg()

        const lights = [];
        lights[ 0 ] = new THREE.PointLight( 0xffffff, 1, 0 );
        lights[ 1 ] = new THREE.PointLight( 0xffffff, 1, 0 );
        lights[ 2 ] = new THREE.PointLight( 0xffffff, 1, 0 );

        lights[ 0 ].position.set( 0, 200, 0 );
        lights[ 1 ].position.set( 100, 200, 100 );
        lights[ 2 ].position.set( - 100, - 200, - 100 );

        this.scene.add( lights[ 0 ] );
        this.scene.add( lights[ 1 ] );
        this.scene.add( lights[ 2 ] );
    };

    startAnimationLoop = () => {
        // this.cube.rotation.x += 0.01;
        // this.cube.rotation.y += 0.01;
        raycaster.setFromCamera( mouse, this.camera );

				var intersects = raycaster.intersectObject( this.cube );

        if ( intersects.length > 0 ) {
          console.log(intersects)
        }

        this.renderer.render( this.scene, this.camera );

        // The window.requestAnimationFrame() method tells the browser that you wish to perform
        // an animation and requests that the browser call a specified function
        // to update an animation before the next repaint
        this.requestID = window.requestAnimationFrame(this.startAnimationLoop);
    };

    handleWindowResize = () => {
        const width = this.mount.clientWidth;
        const height = this.mount.clientHeight;

        this.renderer.setSize( width, height );
        this.camera.aspect = width / height;

        // Note that after making changes to most of camera properties you have to call
        // .updateProjectionMatrix for the changes to take effect.
        this.camera.updateProjectionMatrix();
    };

    taylorUni = () => {

    }

    sunwayUni = () => {
      console.log('sunway')
      this.setState({
        text: "Sunway Uni"
      }) 
    }

    render() {
        
        return (
          <div>
            <div
            style={{ height: '500px' }}
            ref={(mount) => { this.mount = mount }}
            />
            <div>
              <button onClick={()=>{this.taylorUni()}}>Taylor</button>
              <button onClick={()=>{this.sunwayUni()}}>Sunway</button>
            </div>
          </div>
        )
        
    }
}

export default App;
// const rootElement = document.getElementById("root");
// ReactDOM.render(<Container />, rootElement);