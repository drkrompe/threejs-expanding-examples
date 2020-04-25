import React from 'react';
import * as THREE from 'three';
import CameraService from './services/CameraService';
import SceneService from './services/SceneService';
import RendererService from './services/RendererService';
import GuiSelection from './components/7-gui-selection/GuiSelection';
import Dilsprite from './models/Dilsprite';
import Creature from './textures/creature/Creature.png';
import MovingUnit from './models/unit/movingunit/MovingUnit';
import Actions from './models/actions/Actions';
import CommonDataModels from './components/8-common-data-models/CommonDataModels';
import StarVisualizer from './components/8-star-boy/StarVisualizer';

function App() {
	SceneService.scene.background = new THREE.Color(0x68a357)

	window.debug = {
		selectionRayTracing: false,
		mouseDebug: false,
	}

	return (
		<div className="App">
			<StarVisualizer
				renderer={RendererService.renderer}
				camera={CameraService.camera}
				scene={SceneService.scene}
				updateFunction={null}
				updateFunctions={[]}
			/>
		</div>
	);
}

export default App;
