import { Assets, Sprite } from "pixi.js";
import * as Pixi from "pixi.js";
import { useEffect, useMemo, useRef, useState } from "react"

function useSize() {
	const [size, setSize] = useState({ x: 0, y: 0 });

	useEffect(() => {
		function resize() {
			setSize({ x: window.innerWidth, y: window.innerHeight });
		}
		resize();
		window.addEventListener('resize', resize);
		return () => {
			window.removeEventListener('resize', resize);
		}
	}, []);

	return size;
}

function Stars({
	app = new Pixi.Application(),
	starCount = 100,
	starSize = 16,
	flickerAmount = 0.25,
	flickerSpeed = 0.3,
	blinkAmount = 1,
	blinkSpeed = 3,
}) {
	const container = useMemo(() => {
		return new Pixi.Container();
	}, []);
	const size = useSize();

	useEffect(() => {
		if (!app) return;
		app.stage.addChild(container);
		container.x = size.x / 2;
		container.y = size.y / 2;
		let stop = false;
		const sprites = new Array();
		let texture;
		Assets.load('/star.png').then((asset) => texture = asset);

		function starManager() {
			if (texture && sprites.length < starCount && container) {
				const sprite = new Sprite(texture);
				sprite.blendMode = Pixi.LightenBlend;
				const r = Math.random();
				sprite.x = (Math.random() - 0.5) * size.x;
				sprite.y = (Math.random() - 0.5) * size.y;
				sprite.height = sprite.width = starSize * r;
				sprites.push(sprite);
				container.addChild(sprite);
			}
		}
		const starManagerInterval = window.setInterval(starManager, 1000 / 60);

		function draw() {
			if (stop) return;
			else window.requestAnimationFrame(draw);

			const t = performance.now() / 1000;
			for (let i = 0; i < sprites.length; i++) {
				const sprite = sprites[i];
				sprite.alpha = 1;
				if (blinkAmount > 0) sprite.alpha = (Math.sin(t / blinkSpeed + i) * 0.5 + 0.5) * blinkAmount + (1 - blinkAmount);
				if (flickerAmount > 0) sprite.alpha *= Math.sin(t / flickerSpeed + i / 3) * flickerAmount + (1 - flickerAmount);
			}
		}
		draw();

		return () => {
			stop = true;
			container.removeChildren();
			container.removeFromParent();

			try {
				window.clearInterval(starManagerInterval);
			} catch (e) {
				console.error(e);
			}
		}
	}, [app, starCount, starSize, container, size, blinkSpeed, blinkAmount, flickerSpeed, flickerAmount]);
}


function Canvas() {
	const containerRef = useRef();
	const [app, setApp] = useState();
	const screenSize = useSize();

	useEffect(() => {
		let disposing = false;
		const app = new Pixi.Application();
		app.init({
			resizeTo: window,
		}).then(() => {
			if (disposing) return;
			setApp(app);
			app.start();
		});

		return () => {
			disposing = true;
			try {
				if (app && app.stop) app.stop()
			} catch (e) { console.error(e) }
		};

	}, []);

	// useEffect(() => {
	// 	if (!app || !size || size.x === 0 || size.y === 0) return;
	// 	app.resizeTo(size.x, size.y);
	// }, [app, size]);

	useEffect(() => {
		if (!containerRef.current || !app) return;

		let interval;
		if (!app.canvas) {
			interval = setInterval(() => {
				if (!app.canvas) return;
				containerRef.current.appendChild(app.canvas);
				clearInterval(interval);
			}, 20)
		} else {
			containerRef.current.appendChild(app.canvas);
		}

		return () => {
			try {
				clearInterval(interval);
			} catch (e) { console.error(e) }

			if (!containerRef.current || !app.canvas) return;
			containerRef.current.removeChild(app.canvas);
		};
	}, [app, containerRef]);

	const maxSize = Math.max(screenSize.x, screenSize.y);
	const minSize = Math.min(screenSize.x, screenSize.y);

	return (<div ref={containerRef} className="w-full h-full top-0 left-0 absolute">
		<Stars
			app={app}
			starCount={Math.floor(maxSize / 5)}
		/>
		<Stars
			app={app}
			starCount={Math.ceil(maxSize / 100)}
			starSize={minSize / 10}
			flickerAmount={0}
			blinkSpeed={10}
			blinkAmount={0.5}
		/>
	</div>)
}

export default Canvas
