import { Container, Sprite, Stage, Text, useTick } from "@pixi/react"
import { TextStyle } from "pixi.js";
import { useEffect, useRef, useState } from "react"

function Bunny() {
	const bunnyUrl = '/bunny.png';
	const bunnyRef = useRef();
	useTick(() => {
		if (bunnyRef.current) {
			bunnyRef.current.rotation += 0.01;
		}
	});

	return (<>
		<Sprite image={bunnyUrl} anchor={[0.5, 0.5]} x={300} y={150} />
		<Sprite image={bunnyUrl} anchor={[0.5, 0.5]} x={500} y={150} />
		<Sprite ref={bunnyRef} anchor={[0.5, 0.5]} image={bunnyUrl} x={400} y={200} />

		<Container x={200} y={200}>
			<Text
				text="Hello World"
				anchor={0.5}
				x={220}
				y={150}
				style={
					new TextStyle({
						align: 'center',
						fill: '0xffffff',
						fontSize: 50,
						letterSpacing: 20,
						dropShadow: true,
						dropShadowColor: '#E72264',
						dropShadowDistance: 6,
					})
				}
			/>
		</Container>
	</>
	);
}


function Canvas() {
	const [width, setWidth] = useState(0);
	const [height, setHeight] = useState(0);

	useEffect(() => {
		function resize() {
			setWidth(window.innerWidth);
			setHeight(window.innerHeight);
		}
		resize();
		window.addEventListener('resize', resize);
		return () => {
			window.removeEventListener('resize', resize);
		}
	}, []);
	return (<Stage width={width} height={height} className="w-full h-full top-0 left-0 absolute">
		<Bunny />
	</Stage>)
}

export default Canvas
