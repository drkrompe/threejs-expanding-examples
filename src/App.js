import React from 'react';
import * as THREE from 'three';
import CameraService from './services/CameraService';
import SceneService from './services/SceneService';
import RendererService from './services/RendererService';
import TextureLoading from './components/4-texture-loading/TextureLoading';
import SpriteRenderer from './components/5-sprite-renderer/SpriteRenderer';
import SpriteOrder from './components/5-sprite-order/SpriteOrder';
import SelectionMovement from './components/6-selection-movement/SelectionMovement';

function App() {
	CameraService.camera.position.z = -1;
	SceneService.scene.background = new THREE.Color('grey')

	return (
		<div className="App">
			<SelectionMovement
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
