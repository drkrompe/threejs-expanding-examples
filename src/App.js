import React from 'react';
import * as THREE from 'three';
import CameraService from './services/CameraService';
import SceneService from './services/SceneService';
import RendererService from './services/RendererService';
import TextureLoading from './components/4-texture-loading/TextureLoading';
import SpriteRenderer from './components/5-sprite-renderer/SpriteRenderer';
import SpriteOrder from './components/5-sprite-order/SpriteOrder';
import SelectionMovement from './components/6-selection-movement/SelectionMovement';
import SelectionMovementAttack from './components/6-selection-movement-attack/SelectionMovementAttack';
import GuiSelection from './components/7-gui-selection/GuiSelection';
import FightingBack from './components/7-fighting-back/FightingBack';

function App() {
	CameraService.camera.position.z = -1;
	SceneService.scene.background = new THREE.Color(0x7dcd85)

	return (
		<div className="App">
			<GuiSelection
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
