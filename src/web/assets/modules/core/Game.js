/*
 *
 * Game.js
 * Game specific methods and functionality.
 *
 * @author Collin Hover / http://collinhover.com/
 *
 */
(function (main) {
    
    var shared = main.shared = main.shared || {},
		assetPath = "assets/modules/core/Game.js",
		_Game = {},
		_ErrorHandler,
		_Scene,
		_MathHelper,
		_RayHelper,
		_Messenger,
		_Launcher,
		_Intro,
        renderer, 
        renderTarget,
		renderComposer,
        renderPasses,
		scene,
		sceneBG,
		sceneDefault,
		sceneBGDefault,
		camera,
		cameraBG,
		cameraDefault,
		cameraBGDefault,
		physics,
		menus = {},
        currentSection, 
        previousSection,
        paused = false,
		started = false,
		transitionTime = 500,
		navStartDelayTime = 500,
		sectionChangePauseTime = 500,
		introMessageDelayTime = 2000,
		assetsInit = [
            "assets/modules/utils/ErrorHandler.js",
		],
        assetsSetup = [
            "js/three/Three.js",
			"js/Tween.js",
        ],
		assetsSetupExtras = [
            "js/three/ThreeExtras.js",
            "js/three/postprocessing/ShaderExtras.js",
            "js/three/postprocessing/EffectComposer.custom.js",
            "js/three/postprocessing/RenderPass.js",
            "js/three/postprocessing/ShaderPass.js",
            "js/three/postprocessing/MaskPass.js",
            "assets/modules/effects/FocusVignette.js",
		],
		assetsCore = [
			"assets/modules/core/Scene.js",
			"assets/modules/core/Model.js",
			"assets/modules/core/Octree.js",
			"assets/modules/physics/Physics.js",
			"assets/modules/physics/RigidBody.js",
			"assets/modules/utils/MathHelper.js",
			"assets/modules/utils/VectorHelper.js",
			"assets/modules/utils/SceneHelper.js",
			"assets/modules/utils/RayHelper.js",
			"assets/modules/utils/ObjectHelper.js",
			"assets/modules/utils/PhysicsHelper.js"
		],
        assetsLauncher = [
            "assets/modules/sections/Launcher.js"
        ],
        assetsGame = [
			"assets/modules/utils/ObjectMaker.js",
			"assets/modules/core/Player.js",
			"assets/modules/core/CameraControls.js",
			"assets/modules/core/Actions.js",
			"assets/modules/ui/Messenger.js",
			"assets/modules/characters/Character.js",
			"assets/modules/characters/Hero.js",
			"assets/modules/env/World.js",
			"assets/modules/env/WorldIsland.js",
			"assets/modules/env/Water.js",
			"assets/modules/env/Sky.js",
			"assets/modules/puzzles/Puzzle.js",
			"assets/modules/puzzles/PuzzleLibrary.js",
			"assets/modules/puzzles/Grid.js",
			"assets/modules/puzzles/GridModule.js",
			"assets/modules/puzzles/GridModuleState.js",
			"assets/modules/puzzles/GridModel.js",
			"assets/modules/puzzles/GridElement.js",
			"assets/modules/puzzles/GridElementLibrary.js",
			"assets/modules/farming/Planting.js",
			"assets/modules/farming/Dirt.js",
			"assets/modules/sections/Intro.js",
            { path: "assets/models/Whale.js", type: 'model' },
			{ path: "assets/models/Hero.js", type: 'model' },
			{ path: "assets/models/Sun.js", type: 'model' },
			{ path: "assets/models/Cloud_001.js", type: 'model' },
			{ path: "assets/models/Cloud_002.js", type: 'model' },
			{ path: "assets/models/Hut.js", type: 'model' },
			{ path: "assets/models/Hut_Hill.js", type: 'model' },
			{ path: "assets/models/Hut_Steps.js", type: 'model' },
			{ path: "assets/models/Bed.js", type: 'model' },
			{ path: "assets/models/Banana_Leaf_Door.js", type: 'model' },
			{ path: "assets/models/Surfboard.js", type: 'model' },
			{ path: "assets/models/Grass_Clump_001.js", type: 'model' },
			{ path: "assets/models/Grass_Clump_002.js", type: 'model' },
			{ path: "assets/models/Grass_Line_001.js", type: 'model' },
			{ path: "assets/models/Grass_Line_002.js", type: 'model' },
			{ path: "assets/models/Palm_Tree.js", type: 'model' },
			{ path: "assets/models/Palm_Trees.js", type: 'model' },
			{ path: "assets/models/Kukui_Tree.js", type: 'model' },
			{ path: "assets/models/Kukui_Trees.js", type: 'model' },
			{ path: "assets/models/Plant_Dirt_Mound.js", type: 'model' },
			{ path: "assets/models/Plant_Seed.js", type: 'model' },
			{ path: "assets/models/Plant_Taro.js", type: 'model' },
			{ path: "assets/models/Plant_Pineapple.js", type: 'model' },
			{ path: "assets/models/Plant_Rock.js", type: 'model' },
			{ path: "assets/models/Plant_Rock_Purple.js", type: 'model' },
			{ path: "assets/models/Plant_Rock_Blue.js", type: 'model' },
			{ path: "assets/models/Volcano_Large.js", type: 'model' },
			{ path: "assets/models/Volcano_Small.js", type: 'model' },
			{ path: "assets/models/Volcano_Rocks_001.js", type: 'model' },
			{ path: "assets/models/Volcano_Rocks_002.js", type: 'model' },
			{ path: "assets/models/Volcano_Rocks_003.js", type: 'model' },
			{ path: "assets/models/Volcano_Rocks_004.js", type: 'model' },
			{ path: "assets/models/Volcano_Rocks_005.js", type: 'model' },
			{ path: "assets/models/Puzzle_Tutorial.js", type: 'model' },
			{ path: "assets/models/Puzzle_Tutorial_Grid.js", type: 'model' },
			{ path: "assets/models/Puzzle_Tutorial_Toggle.js", type: 'model' },
			{ path: "assets/models/Puzzle_Rolling_Hills.js", type: 'model' },
			{ path: "assets/models/Puzzle_Rolling_Hills_Grid.js", type: 'model' },
			{ path: "assets/models/Puzzle_Rolling_Hills_Toggle.js", type: 'model' },
			{ path: "assets/models/Puzzle_Basics_Abilities.js", type: 'model' },
			{ path: "assets/models/Puzzle_Basics_Abilities_Grid.js", type: 'model' },
			"assets/textures/skybox_world_posx.jpg",
            "assets/textures/skybox_world_negx.jpg",
			"assets/textures/skybox_world_posy.jpg",
            "assets/textures/skybox_world_negy.jpg",
			"assets/textures/skybox_world_posz.jpg",
            "assets/textures/skybox_world_negz.jpg",
            "assets/textures/water_world_512.png",
            "assets/textures/dirt_128.jpg"
        ],
		loadingHeader = 'Hold on, we need some stuff from Hawaii...',
		loadingTips = [
            ///////////////////////////////////////////// = bad sentence size
            "Aloha kaua means may there be friendship or love between us.",
            "Mahalo nui loa means thanks very much.",
            "Kali iki means wait a moment.",
            "Ko'u hoaloha means my friend.",
            "Kane means male or man.",
            "Wahine means female or woman.",
            "Ali'i kane means king or chieftan.",
            "Ali'i wahine means queen or chiefess.",
            "He mea ho'opa'ani means to play a game.",
            "Kai means sea or ocean.",
            "'Opua means puffy clouds.",
			"Kai 'Opua means clouds over the ocean.",
            "Iki means small or little.",
            "Nui means large or huge."
        ];
    
    /*===================================================
    
    public properties
    
    =====================================================*/
    
	// functions
	
	_Game.start = start;
	_Game.stop = stop;
    _Game.resume = resume;
    _Game.pause = pause;
	
	_Game.add_to_scene = add_to_scene;
	_Game.remove_from_scene = remove_from_scene;
	
	_Game.get_pointer_intersection = get_pointer_intersection;
	
	// getters and setters
	
	Object.defineProperty(_Game, 'paused', { 
		get : function () { return paused; }
	});
	
	Object.defineProperty(_Game, 'started', { 
		get : function () { return started; }
	});
	
	Object.defineProperty(_Game, 'scene', { 
		get : function () { return scene; },  
		set : set_scene
	});
	
	Object.defineProperty(_Game, 'sceneBG', { 
		get : function () { return sceneBG; },  
		set : set_scene_bg
	});
	
	Object.defineProperty(_Game, 'camera', { 
		get : function () { return camera; },  
		set : set_camera
	});
	
	Object.defineProperty(_Game, 'cameraBG', { 
		get : function () { return cameraBG; },  
		set : set_camera_bg
	});

	main.asset_register( assetPath, { 
		data: _Game,
		readyAutoUpdate: false,
		requirements: assetsInit,
		callbacksOnReqs: init_internal,
		wait: true
	});
	
	/*===================================================
    
    internal init and loading
    
    =====================================================*/
	
	function init_internal ( err ) {
		console.log('internal game');
		_ErrorHandler = err;
		
		// register error listeners
		
		shared.signals.error.add( on_error );
		
		// check for errors
        
        if (_ErrorHandler.check()) {
			
            _ErrorHandler.process();
			
        }
        // safe to start game
        else {
			
			// set loading messages
			
			main.loadingHeader = loadingHeader;
			main.loadingTips = loadingTips;
			
			// start loading
			
			load_setup();
			
        }
		
	}
	
	function load_setup () {
		
		main.asset_require( assetsSetup, [ load_setup_extras ], true );
		
	}
	
	function load_setup_extras () {
		
		main.asset_require( assetsSetupExtras, [ init_setup, load_core ], true );
		
	}
	
	function load_core () {
		
		main.asset_require( assetsCore, [ init_core, load_launcher ], true );
		
	}
	
	function load_launcher () {
		
		main.asset_require( assetsLauncher, [init_launcher, load_game], true );
		
	}
	
	function load_game () {
		
		main.asset_require( assetsGame, init_game, true );
		
	}
	
	/*===================================================
    
    setup
    
    =====================================================*/
    
    function init_setup () {
		
		// universe gravity
		
		shared.universeGravitySource = new THREE.Vector3( 0, 0, 0 );
		shared.universeGravityMagnitude = new THREE.Vector3( 0, -1, 0 );
		
		// cardinal axes
		
		shared.cardinalAxes = {
			up: new THREE.Vector3( 0, 1, 0 ),
			forward: new THREE.Vector3( 0, 0, 1 ),
			right: new THREE.Vector3( -1, 0, 0 )
		}
        
        // game signals
		
        shared.signals = shared.signals || {};
		
        shared.signals.gamePaused = new signals.Signal();
        shared.signals.gameResumed = new signals.Signal();
        shared.signals.gameUpdated = new signals.Signal();
		shared.signals.gameStarted = new signals.Signal();
		shared.signals.gameStopped = new signals.Signal();
		
		shared.signals.gamePointerTapped = new signals.Signal();
		shared.signals.gamePointerDoubleTapped = new signals.Signal();
		shared.signals.gamePointerHeld = new signals.Signal();
		shared.signals.gamePointerDragStarted = new signals.Signal();
		shared.signals.gamePointerDragged = new signals.Signal();
		shared.signals.gamePointerDragEnded = new signals.Signal();
		shared.signals.gamePointerWheel = new signals.Signal();
		
		// game events
		
		shared.domElements.$game
			.on( 'tap', on_pointer_tapped )
			.on( 'doubletap', on_pointer_doubletapped )
			.on( 'hold', on_pointer_held )
			.on( 'dragstart', on_pointer_dragstarted )
			.on( 'drag', $.throttle( shared.throttleTimeShort, true, on_pointer_dragged ) )
			.on( 'dragend', on_pointer_dragended )
			.on( 'mousewheel DOMMouseScroll', on_pointer_wheel )
			.on( 'contextmenu', on_context_menu );
		
		// renderer
		
        renderer = new THREE.WebGLRenderer( { antialias: true, clearColor: 0x000000, clearAlpha: 0, maxLights: 4 } );
        renderer.setSize( shared.gameWidth, shared.gameHeight );
        renderer.autoClear = false;
		
		// shadows
		/*
		renderer.shadowCameraNear = 3;
		renderer.shadowCameraFar = 20000;
		renderer.shadowCameraFov = 90;
		
		renderer.shadowMapBias = 0.0039;
		renderer.shadowMapDarkness = 0.5;
		renderer.shadowMapWidth = 2048;
		renderer.shadowMapHeight = 2048;
		
		renderer.shadowMapEnabled = true;
		renderer.shadowMapSoft = true;
		*/
        // render target
        renderTarget = new THREE.WebGLRenderTarget( shared.gameWidth, shared.gameHeight, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter } );
        
        // share renderer
        shared.renderer = renderer;
        shared.renderTarget = renderTarget;
		
    }
	
	function init_core () {
		
		var shaderScreen = THREE.ShaderExtras[ "screen" ],
            shaderFocusVignette = main.get_asset_data("assets/modules/effects/FocusVignette");
		
		// utility
		
		_Scene = main.get_asset_data( "assets/modules/core/Scene.js" );
		_MathHelper = main.get_asset_data( "assets/modules/utils/MathHelper.js" );
		
		// scenes
		
		sceneDefault = new _Scene.Instance();
		sceneBGDefault = new _Scene.Instance();
		
        // fog
		
        sceneDefault.fog = undefined;
		
		// physics
		
		physics = sceneDefault.physics;
		
		// camera
		
		cameraDefault = new THREE.PerspectiveCamera(60, shared.gameWidth / shared.gameHeight, 1, 20000);
		cameraBGDefault = new THREE.PerspectiveCamera(60, shared.gameWidth / shared.gameHeight, 1, 20000);
		
		cameraDefault.useQuaternion = cameraBGDefault.useQuaternion = true;
		
		// passes
        
        renderPasses = {
			bg: new THREE.RenderPass( sceneBGDefault, cameraBGDefault ),
            env: new THREE.RenderPass( sceneDefault, cameraDefault ),
            screen: new THREE.ShaderPass( shaderScreen ),
            focusVignette: new THREE.ShaderPass ( shaderFocusVignette )
        };
        
		// settings
		
		renderPasses.env.clear = false;
		
        renderPasses.screen.renderToScreen = true;
		
        renderPasses.focusVignette.uniforms[ "screenWidth" ].value = shared.gameWidth;
        renderPasses.focusVignette.uniforms[ "screenHeight" ].value = shared.gameHeight;
        renderPasses.focusVignette.uniforms[ "vingenettingOffset" ].value = 0.6;
        renderPasses.focusVignette.uniforms[ "vingenettingDarkening" ].value = 0.5;
        renderPasses.focusVignette.uniforms[ "sampleDistance" ].value = 0.1;
        renderPasses.focusVignette.uniforms[ "waveFactor" ].value = 0.3;
		
		// set default scene and camera
		
		set_default_cameras_scenes();
		
        // composer
        
        set_render_processing();
		
		// add renderer to display
		
		shared.domElements.$game.prepend( renderer.domElement );
		
		// ui
		
		shared.domElements.$primaryActionsActive = $( '#primaryActionsActive' );
		shared.domElements.$primaryActionsInactive = $( '#primaryActionsInactive' );
		shared.domElements.$navStart = $( '#navStart' );
		shared.domElements.$buttonGamePause = $('.button-gamePause');
		shared.domElements.$buttonGameResume = $('.button-gameResume');
		shared.domElements.$menuFarming = $('#menuFarming');
		shared.domElements.$menuOptions = $('#menuOptions');
		shared.domElements.$pauseMessage = $('#pauseMessage');
		
		// ui menus
		
		shared.domElements.$tools = $('#puzzleTools');
		
		shared.domElements.$puzzle = $('#puzzle');
		shared.domElements.$puzzleActive = $( "#puzzleActive" );
		shared.domElements.$puzzleActiveWarning = $( "#puzzleActiveWarning" );
		shared.domElements.$puzzleActiveName = $( ".puzzle-active-name" );
		shared.domElements.$puzzleActiveScoreBar = $( "#puzzleActiveScoreBar" );
		shared.domElements.$puzzleActiveElementCount = $( ".puzzle-active-elementCount" );
		shared.domElements.$puzzleActiveNumElementsMin = $( ".puzzle-active-numElementsMin" );
		shared.domElements.$puzzleActiveNumShapesRequired = $( ".puzzle-active-numShapesRequired" );
		shared.domElements.$puzzleActiveShapes = $( "#puzzleActiveShapes" );
		shared.domElements.$puzzleActiveShapesRequiredWarning = $( "#puzzleActiveShapesRequiredWarning" );
		shared.domElements.$puzzleActiveShapesPicker = $( "#puzzleActiveShapesPicker" );
		shared.domElements.$puzzleActiveStatusIcons = $( ".puzzle-statusIcon" );
		shared.domElements.$puzzleActiveCompletionIcons = $( ".puzzle-completionIcon" );
		shared.domElements.$puzzleActiveStatusText = $( "#puzzleActiveStatusText" );
		shared.domElements.$puzzleActiveCompletionText = $( "#puzzleActiveCompletionText" );
		shared.domElements.$puzzleActiveMap = $( "#puzzleActiveMap" );
		shared.domElements.$puzzleActiveRewards = $( "#puzzleActiveRewards" );
		
		shared.domElements.$plant = $('#plant');
		shared.domElements.$plantActive = $("#plantActive");
		shared.domElements.$plantActiveWarning = $("#plantActiveWarning");
		shared.domElements.$plantActive3DPortrait = $("#plantActive3DPortrait");
		shared.domElements.$plantActiveShape = $("#plantActiveShape");
		shared.domElements.$plantActiveShapeIcon = $("#plantActiveShapeIcon");
		shared.domElements.$plantActiveSkin = $("#plantActiveSkin");
		shared.domElements.$plantActiveSkinIcon = $("#plantActiveSkinIcon");
		
		shared.domElements.$collection = $('#collection');
		
		// show menus nav
		
		main.dom_fade( {
			element: shared.domElements.$navMenus.find( '.nav.hidden' )
		} );
		
		// pause / resume
		
		shared.domElements.$buttonGamePause.on( 'tap', pause );
		shared.domElements.$buttonGameResume.on( 'tap', resume );
		
		// if focus lost, pause game
		
		shared.signals.focusLost.add( pause );
		
		// primary action items
		
		$('.primaryAction-item').on('show.active', function () {
			shared.domElements.$primaryActionsActive.append( this );
		});
		$('.primaryAction-item').on('hidden.active', function () {
			shared.domElements.$primaryActionsInactive.append( this );
		});
		
		// for each tab toggle
        
        shared.domElements.$tabToggles.each( function () {
            
            var $toggle = $( this ),
				$tab = $( $toggle.attr( 'href' ) ),
				isMenu = shared.domElements.$menus.is( $tab );
			
			// for menu toggles, pause/resume game
			
			if ( isMenu === true ) {
				
				$toggle.on( 'show showing', function () {
						
						// if showing
						
						if ( $tab.hasClass( 'active' ) !== true || paused === false ) {
							
							pause();
							
						}
						else {
							
							resume();
							
						}
					
				} );
			
			}
			
        } );
		
		// hide uiOutGame
		
		main.dom_fade( {
			element: shared.domElements.$uiOutGame,
			time: 0,
			opacity: 0
		} );
		
		// resize
		
        shared.signals.windowResized.add( resize );
		resize();
		
		// set ready
		
		main.asset_ready( assetPath );
        
		// start updating
        
        shared.signals.updated.add( update );
		
	}
	
	/*===================================================
    
    init launcher
    
    =====================================================*/
	
	function init_launcher () {
		
		_Launcher = main.get_asset_data( "assets/modules/sections/Launcher.js" );
		
		set_section( _Launcher );
		
	}
	
	/*===================================================
    
    init game
    
    =====================================================*/
	
    function init_game () {
		console.log( 'init game');
		var l, m, b;
		
		// assets
		
		_RayHelper = main.get_asset_data( "assets/modules/utils/RayHelper.js" );
		_Messenger = main.get_asset_data( "assets/modules/ui/Messenger.js" );
		
		// ui
		
		$( '#buttonStart' ).on( 'tap', start );
		$( '#buttonExitGame' ).on( 'tap', stop );
		
		// fade start menu in after short delay
		
		setTimeout( function () {
			
			main.dom_fade( {
				element: shared.domElements.$navStart
			} );
			
		}, navStartDelayTime );
		
		/*
		l = _GUI.layers;
		m = _GUI.menus;
		b = _GUI.buttons;
		
		m.start.childrenByID.play.callback = function () {
			start_game();
		};
		m.start.childrenByID.play.context = this;
		
		m.main.childrenByID.resume.callback = function () {
			resume();
		};
		m.main.childrenByID.resume.context = this;
		
		b.end.callback = function () {
			stop_game();
		};
		b.end.context = this;
		
		b.mainMenu.callback = function () {
			_Game.pause();
		};
		b.mainMenu.context = this;
		
		// menus
		
		m.start.alignment = 'center';
		m.main.alignment = 'center';
		
		m.navigation.spacingBottom = 20;
		m.navigation.alignment = 'bottomcenter';
		
		// setup ui groups
		
		_GUI.add_to_group( 'start', [
			{ child: m.start, parent: l.ui }
		] );
		
		_GUI.add_to_group( 'pause', [
			{ child: m.main, parent: l.uiPriority }
		] );
		
		_GUI.add_to_group( 'ingame', [
			{ child: m.navigation, parent: l.ui }
		] );
		
		_GUI.add_to_group( 'constant', [ { child: b.fullscreenEnter, parent: l.ui } ] );
		
		// show initial groups
		
		_GUI.show_group( 'constant' );
		_GUI.show_group( 'start' );
		*/
		
    }
	
	/*===================================================
    
    event functions
    
    =====================================================*/
	
	function on_pointer_tapped ( e ) {
		
		var pointer;
		
		pointer = main.reposition_pointer( e );
		
		shared.signals.gamePointerTapped.dispatch( e, pointer );
		
	}
	
	function on_pointer_doubletapped ( e ) {
		
		var pointer;
		
		pointer = main.reposition_pointer( e );
		
		shared.signals.gamePointerDoubleTapped.dispatch( e, pointer );
		
	}
	
	function on_pointer_held ( e ) {
		
		var pointer;
		
		pointer = main.reposition_pointer( e );
			
		shared.signals.gamePointerHeld.dispatch( e, pointer );
		
	}
	
	function on_pointer_dragstarted ( e ) {
		
		var pointer;
		
		pointer = main.reposition_pointer( e );
		
		shared.signals.gamePointerDragStarted.dispatch( e, pointer );
		
	}
    
    function on_pointer_dragged( e ) {
		
		var pointer;
		
		pointer = main.reposition_pointer( e );
		
		shared.signals.gamePointerDragged.dispatch( e, pointer );
		
    }
	
	function on_pointer_dragended ( e ) {
		
		var pointer;
		
		pointer = main.reposition_pointer( e );
		
		shared.signals.gamePointerDragEnded.dispatch( e, pointer );
		
	}
	
	function on_pointer_wheel ( e ) {
		
		var eo = e.originalEvent || e;
		
		shared.timeSinceInteraction = 0;
		
		// normalize scroll across browsers
		// simple implementation, removes acceleration
		
		e.wheelDelta = eo.wheelDelta = ( ( eo.detail < 0 || eo.wheelDelta > 0 ) ? 1 : -1 ) * shared.pointerWheelSpeed;
		
		shared.signals.gamePointerWheel.dispatch( e );
        
        e.preventDefault();
		
    }
	
	function on_context_menu ( e ) {
		
		// disable right click menu while in game
		
		e.preventDefault();
		
	}
	
	/*===================================================
    
    render functions
    
    =====================================================*/
	
	function set_render_processing ( passesNames ) {
		
		var i, l,
			requiredPre = ['bg', 'env' ],
			requiredPost = ['screen'],
			passName,
			bgPass = renderPasses.bg,
			envPass = renderPasses.env,
			defaultPassIndex;
		
		// init composer
		
		renderComposer = new THREE.EffectComposer( renderer, renderTarget );
		
		// check that passes camera and scene match current
		
		// bg
		
		if ( bgPass.scene !== sceneBG ) {
			bgPass.scene = sceneBG;
		}
		
		if ( bgPass.camera !== cameraBG ) {
			bgPass.camera = cameraBG;
		}
		
		// env
		
		if ( envPass.scene !== scene ) {
			envPass.scene = scene;
		}
		
		if ( envPass.camera !== camera ) {
			envPass.camera = camera;
		}
		
		// if should use default passes
		
		if ( typeof passesNames === 'undefined' || passesNames.hasOwnProperty('length') === false ) {
			
			passesNames = [];
			
		}
		
		// add required
		
		// required pre
		
		for ( i = requiredPre.length - 1; i >= 0; i-- ) {
			
			passName = requiredPre[ i ];
			
			defaultPassIndex = passesNames.indexOf( passName );
			
			if ( defaultPassIndex === -1 ) {
				
				passesNames.unshift( passName );
				
			}
			
		}
		
		// required post
		
		for ( i = requiredPost.length - 1; i >= 0; i-- ) {
			
			passName = requiredPost[ i ];
			
			defaultPassIndex = passesNames.indexOf( passName );
			
			if ( defaultPassIndex === -1 ) {
				
				passesNames.push( passName );
				
			}
			
		}
		
		// add each pass in passes names
		
		for ( i = 0, l = passesNames.length; i < l; i ++ ) {
			
			passName = passesNames[ i ];
			
			if ( typeof renderPasses[ passName ] !== 'undefined' ) {
				
				renderComposer.addPass( renderPasses[ passName ] );
				
			}
			
		}
		
	}
	
	/*===================================================
    
    scene functions
    
    =====================================================*/
	
	function set_scene ( sceneNew ) {
		
		var scenePrev = scene;
		
		renderPasses.env.scene = scene = sceneNew || sceneDefault;
		
		if( scene !== scenePrev && typeof camera !== 'undefined') {
			
			if ( typeof scenePrev !== 'undefined' ) {
				scenePrev.remove( camera );
			}
			
			scene.add( camera );
			
		}
		
	}
	
	function set_scene_bg ( sceneNew ) {
		
		var sceneBGPrev = sceneBG;
		
		renderPasses.bg.scene = sceneBG = sceneNew || sceneBGDefault;
		
		if( sceneBG !== sceneBGPrev && typeof cameraBG !== 'undefined') {
			
			if ( typeof sceneBGPrev !== 'undefined' ) {
				sceneBGPrev.remove( cameraBG );
			}
			
			sceneBG.add( cameraBG );
			
		}
		
	}
	
	function add_to_scene ( objects, sceneDefault ) {
		
		var i, l,
			object,
			object3D,
			sceneTarget,
			callback;
		
		// handle parameters
		
		sceneDefault = sceneDefault || scene;
		
		// for each object
		
		if ( objects.hasOwnProperty('length') === false ) {
			objects = [ objects ];
		}
		
		for ( i = 0, l = objects.length; i < l; i ++ ) {
		
			object = objects[ i ];
			
			callback = object.callbackAdd;
			
			sceneTarget = object.sceneTarget || sceneDefault;
			
			object3D = object.addTarget || object;
			
			// add
			
			if ( typeof object3D !== 'undefined' ) {
				
				sceneTarget.add( object3D );
				
			}
			
			// if callback passed
			
			if ( typeof callback === 'function' ) {
				
				callback.call( this );
				
			}
			
        }
		
	}
	
	function remove_from_scene ( objects, sceneDefault ) {
		
		var i, l,
			object,
			object3D,
			sceneTarget,
			callback;
		
		// handle parameters
		
		sceneDefault = sceneDefault || scene;
		
		// for each object
		
		if ( objects.hasOwnProperty('length') === false ) {
			objects = [ objects ];
		}
		
		for ( i = 0, l = objects.length; i < l; i ++ ) {
		
			object = objects[ i ];
			
			callback = object.callbackRemove;
			
			sceneTarget = object.sceneTarget || sceneDefault;
			
			object3D = object.addTarget || object;
			
			// remove
			
			if ( typeof object3D !== 'undefined' ) {
				
				sceneTarget.remove( object3D );
				
			}
			
			// if callback passed
			
			if ( typeof callback === 'function' ) {
				
				callback.call( this );
				
			}
			
        }
		
	}
	
	/*===================================================
    
    camera functions
    
    =====================================================*/
	
	function set_camera ( cameraNew ) {
		
		var cameraPrev = camera;
		
		if ( typeof cameraPrev !== 'undefined' && typeof scene !== 'undefined' ) {
			
			scene.remove( cameraPrev );
			
		}
		
		renderPasses.env.camera = camera = cameraNew || cameraDefault;
		
		if ( typeof scene !== 'undefined' ) {
			
			scene.add( camera );
			
		}
		
	}
	
	function set_camera_bg ( cameraNew ) {
		
		var cameraBGPrev = cameraBG;
		
		if ( typeof cameraBGPrev !== 'undefined' && typeof sceneBG !== 'undefined' ) {
			
			sceneBG.remove( cameraBGPrev );
			
		}
		
		renderPasses.bg.camera = cameraBG = cameraNew || cameraBGDefault;
		
		if ( typeof sceneBG !== 'undefined' ) {
			
			sceneBG.add( cameraBG );
			
		}
		
	}
	
	/*===================================================
    
    pointer functions
    
    =====================================================*/
	
	function get_pointer_intersection ( parameters ) {
		
		var intersection;
		
		// handle parameters
		
		parameters = parameters || {};
		
		if ( typeof parameters.objects === 'undefined' ) {
			
			parameters.octree = parameters.octree || scene.octree;
			
		}
		
		parameters.pointer = parameters.pointer || main.get_pointer();
		parameters.camera = parameters.camera || camera;
		
		// intersection
		
		return _RayHelper.raycast( parameters );
		
	}
	
	/*===================================================
    
    section functions
    
    =====================================================*/
	
	function set_default_cameras_scenes () {
		
		set_scene();
		set_scene_bg();
		
		set_camera();
		set_camera_bg();
		
	}

    function set_section ( section, callback ) {
		
		var hadPreviousSection = false,
			newSectionCallback = function () {
				
				if ( typeof previousSection !== 'undefined' ) {
					
					previousSection.remove();
					
				}
				
				section.resize(shared.gameWidth, shared.gameHeight);
				
                section.show();
				
                currentSection = section;
				
				// hide blocker
				
				main.dom_fade( {
					element: shared.domElements.$uiBlocker,
					time: transitionTime,
					opacity: 0
				} );
				
				resume();
				
				if ( typeof callback !== 'undefined' ) {
					
					callback.call();
					
				}
				
			};
		
		// pause game while changing sections
		
		pause( true );
		
        // hide current section
        if (typeof currentSection !== 'undefined') {
			
			hadPreviousSection = true;
            
            previousSection = currentSection;
            
            previousSection.hide();
			
			// block ui
            
			main.dom_fade( {
				element: shared.domElements.$uiBlocker,
				time: transitionTime,
				opacity: 1
			} );
            
        }
		
        // no current section
		
        currentSection = undefined;
		
		// default scene and camera
		
		set_default_cameras_scenes();
		
		// set started
		
		if ( typeof startedValue !== 'undefined' ) {
		
			started = startedValue;
			
		}
        
        // start and show new section
        if (typeof section !== 'undefined') {
			
            // wait for blocker to finish fading in
			
			if ( hadPreviousSection === true ) {
				
				window.requestTimeout( function () {
					
					newSectionCallback();
					
				}, transitionTime );
			
			}
			// no previous section, create new immediately
			else {
				
				newSectionCallback();
				
			}
            
        }
		
    }
	
	/*===================================================
    
    start / stop game
    
    =====================================================*/
    
    function start () {
		
		if ( started === false ) {
			console.log('GAME: START');
			// set started
			
			started = true;
			
			// assets
			
			_Intro = main.get_asset_data( 'assets/modules/sections/Intro.js' );
			
			// hide start nav
			
			main.dom_fade( {
				element: shared.domElements.$navStart,
				opacity: 0
			} );
			
			// set intro section
			
			set_section( _Intro, function () {
				
				// TODO: show in game ui
				
				// TODO: show intro messages
				/*
				window.requestTimeout( function () {
					
					_Messenger.show_message( { 
						image: shared.pathToIcons + "character_rev_64.png",
						title: "Hey, welcome to Kai 'Opua!",
						body: _GUI.messages.gameplay,
						priority: true,
						uiGameDimmerOpacity: 0.9
					} );
					
					_Messenger.show_message( {
						title: "Here's how to play:",
						body: _GUI.messages.controls,
						priority: true,
						uiGameDimmerOpacity: 0.9
					} );
					
				}, introMessageDelayTime );
				*/
			} );
			
			// signal
			
			shared.signals.gameStarted.dispatch();
			
		}
		
    }
	
	function stop () {
		
		if ( started === true ) {
			console.log('GAME: STOP');
			started = false;
			
			// TODO: clear in game ui
			
			// signal
			
			shared.signals.gameStopped.dispatch();
			
			// set launcher section
			
			set_section( _Launcher, function () {
			
				// show start menu
				
				main.dom_fade( {
					element: shared.domElements.$navStart
				} );
				
			});
		
		}
		
	}
	
	/*===================================================
    
    pause / resume
    
    =====================================================*/
	
    function pause ( preventDefault ) {
		// set state
		
        if (paused === false) {
            console.log('GAME: PAUSE');
            paused = true;
			
			// hide pause button
			
			main.dom_fade( {
				element: shared.domElements.$buttonGamePause,
				opacity: 0,
				time: 0
			} );
			
			// uiGameDimmer
			
			main.dom_fade( {
				element: shared.domElements.$uiGameDimmer,
				time: transitionTime,
				opacity: 0.75
			} );
			
			// default actions
			
			if ( preventDefault !== true ) {
				
				// show resume button
				
				main.dom_fade( {
					element: shared.domElements.$buttonGameResume,
					opacity: 1
				} );
				
				// show uiOutGame
				
				main.dom_fade( {
					element: shared.domElements.$uiOutGame,
					time: transitionTime,
					opacity: 1
				} );
				
				// add listener for click on uiGameDimmer
				
				shared.domElements.$uiGameDimmer.on( 'tap.resume', resume );
				
			}
			
			// when started
			
			if ( started === true ) {
				
				
				
			}
			
			// signal
            
            shared.signals.gamePaused.dispatch();
			
			// render once to ensure user is not surprised when resuming
			
			render();
            
        }
		
    }
    
    function resume () {
		
        if ( paused === true && _ErrorHandler.errorState !== true && ( typeof _Messenger === 'undefined' || _Messenger.active !== true ) ) {
			console.log('GAME: RESUME');
			
			// hide uiOutGame
			
			main.dom_fade( {
				element: shared.domElements.$uiOutGame,
				time: transitionTime,
				opacity: 0
			} );
			
			// uiGameDimmer
			
			shared.domElements.$uiGameDimmer.off( '.resume' );
			main.dom_fade( {
				element: shared.domElements.$uiGameDimmer,
				time: transitionTime,
				opacity: 0
			} );
			
			// hide resume button
			
			main.dom_fade( {
				element: shared.domElements.$buttonGameResume,
				opacity: 0,
				time: 0
			} );
			
			// show pause button
			
			main.dom_fade( {
				element: shared.domElements.$buttonGamePause,
				opacity: 1
			} );
			
			// scroll to top
			
			$.scrollTo( shared.domElements.$game, shared.domScrollTime, {
				easing: main.shared.domScrollEasing
			} );
			
			// when started
			
			if ( started === true ) {
				
				
				
			}
			
			paused = false;
			
			shared.signals.gameResumed.dispatch();
            
        }
    }
	
	/*===================================================
    
    update / render
    
    =====================================================*/
    
    function update ( timeDelta, timeDeltaMod ) {
		
		// update
		
		if ( paused !== true ) {
			
			// tween update
			
			TWEEN.update();
			
			// update physics
			
			if ( physics ) {
				
				physics.update( timeDelta, timeDeltaMod );
				
			}
			
			// update all others
			
			shared.signals.gameUpdated.dispatch( timeDelta, timeDeltaMod );
			
			// have camera bg mimic camera rotation
			
			cameraBG.quaternion.copy( camera.quaternion );
			
			// finish frame
			
			render();
			
		}
			
    }
	
	function render() {
		
		renderer.setViewport( 0, 0, shared.gameWidth, shared.gameHeight );
		
        renderer.clear();
        
		renderComposer.render();
		
	}
    
    function resize( screenWidth, screenHeight ) {
		
		var gameWidth = shared.gameWidth = shared.domElements.$game.width(),
			gameHeight = shared.gameHeight = shared.domElements.$game.height();
		
		// render passes
		
		renderPasses.focusVignette.uniforms[ "screenWidth" ].value = gameWidth;
        renderPasses.focusVignette.uniforms[ "screenHeight" ].value = gameHeight;
        
        // renderer
		
        renderer.setSize( gameWidth, gameHeight );
        renderTarget.width = gameWidth;
        renderTarget.height = gameHeight;
		
		// cameras
		
		camera.aspect = gameWidth / gameHeight;
        camera.updateProjectionMatrix();
		
		cameraBG.aspect = gameWidth / gameHeight;
        cameraBG.updateProjectionMatrix();
        
		// composer
		
        renderComposer.reset( renderTarget );
		
		// re-render
		
		render();
        
    }
	
	/*===================================================
	
	utility
	
	=====================================================*/
	
	function on_error ( error, url, lineNumber ) {
        
		// pause game
		
        pause( true );
		
		// check error handler state
		
		if ( _ErrorHandler.errorState !== true ) {
			
			_ErrorHandler.generate( error, url, lineNumber );
			
		}
		
		// save game
		// TODO
		
		// debug
        
        throw error + " at " + lineNumber + " in " + url;
        
    }
    
} ( KAIOPUA ) );