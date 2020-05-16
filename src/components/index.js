import React, { Component } from "react";
import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {OBJLoader} from "three/examples/jsm/loaders/OBJLoader";
import {ColladaLoader} from "three/examples/jsm/loaders/ColladaLoader";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      img: require('./img/TaylorsCollege_logo.png'),
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
        this.scene.background = new THREE.Color(0xdddddd);
        this.camera = new THREE.PerspectiveCamera(
            75, // fov = field of view
            width / height, // aspect ratio
            0.1, // near plane
            1000 // far plane
        );
        // this.camera.position.z = 19; 
        this.camera.position.set(5.7,1.5,-5);
        var hlight = new THREE.AmbientLight ("#ffe6ff",0.4);
        this.scene.add(hlight);
        this.controls = new OrbitControls( this.camera, this.mount );
        
        this.renderer = new THREE.WebGLRenderer({ alpha: true });
        // this.renderer.setClearColor( 0xffffff, 0);
        this.renderer.setSize( width, height );
        this.mount.appendChild( this.renderer.domElement ); // mount using React ref
    };

    onLoad = ( dae, position ) => {

      // const model = gltf.scene.children[ 0 ];
      // model.position.copy( position );
  
      // const animation = gltf.animations[ 0 ];
      // const mixer = new THREE.AnimationMixer( model );
  
      // // we'll check every object in the scene for
      // // this function and call it once per frame
      // model.userData.onUpdate = ( delta ) => {
      //   mixer.update( delta );
      // };
  
      // const action = mixer.clipAction( animation );
      // action.play();
  
      this.scene.add( dae.scene );
  
    };

    renderCubeText = () => {
      var canvas = document.createElement("canvas");
			var context = canvas.getContext("2d");
			
			var x = canvas.width / 2;
			var y = canvas.height / 2;
			context.font = "30pt Calibri";
      context.textAlign = "center";
      context.fillStyle = "grey";

			context.fillRect(0,0,600,600);
			context.fillStyle = "white";
      context.fillText( this.state.text, x, y);
      let strDataURI = canvas.toDataURL("image/jpeg");
			let imag = new Image();
      imag.src = strDataURI;
      var cubeMaterials = new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( imag.src ) } );

      const geometry = new THREE.PlaneGeometry(2, 0, 0);

      let material = new THREE.MeshFaceMaterial( cubeMaterials );
      this.cube = new THREE.Mesh( geometry, material );
      this.cube.position.x = 4;
      // this.cube.position.z = 0;
      this.cube.position.y = 2;

      // this.cube.rotation.x = 0.00;
      this.cube.rotation.y = 3;
      this.cube.rotation.z = 0;
      
      this.scene.add( this.cube );
    }

    renderCubeImg = () => {
      const geometry = new THREE.PlaneGeometry(0, 0, 0);
      let cubeMaterials =  new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( this.state.img ), opacity:0.8, side: THREE.DoubleSide});

      let material = new THREE.MeshFaceMaterial( cubeMaterials );
      this.cube = new THREE.Mesh( geometry, material );
      
      this.cube.position.x = 1.6;
      this.cube.position.y = 1.2;
      this.cube.position.z = -3.5;

      // this.cube.rotation.x = 0.00;
      this.cube.rotation.y = 1.6;
      this.cube.rotation.z = 0;

      this.scene.add( this.cube );
    }

    addCustomSceneObjects = () => {
      
        this.loader = new ColladaLoader();
        // this.loader = new GLTFLoader();
        const parrotPosition = new THREE.Vector3( 0, 0, 50 );
        const onError = ( errorMessage ) => { console.log( errorMessage ); };
        this.loader.load( 
          require('./model/Booth.dae'), 
          // 'https://threejs.org/examples/models/gltf/Parrot.glb', 
          dae => this.onLoad( dae, parrotPosition ), null, onError );      

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
      this.setState({
        text: "Taylor's Uni",
        img: require('./img/TaylorsCollege_logo.png')
      },()=>{
        this.renderCubeImg()
        this.renderCubeText()
      }) 
    }

    sunwayUni = () => {
      this.setState({
        text: "Sunway Uni",
        img: require('./img/SunwayUniLogo.png')
      },()=>{
        this.renderCubeImg()
        this.renderCubeText()
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