
from flask import Flask, render_template, request, jsonify
from PIL import Image
from colorthief import ColorThief
import io
import os

app = Flask(__name__)

def rgb_to_hex(rgb):
	return '#%02x%02x%02x' % rgb

def generate_gradient(colors):
	hex_colors = [rgb_to_hex(c) for c in colors]
	return f"linear-gradient(90deg, {', '.join(hex_colors)})"

def generate_css(colors):
	hex_colors = [rgb_to_hex(c) for c in colors]
	css = '\n'.join([f"--color{i+1}: {c};" for i, c in enumerate(hex_colors)])
	return f":root {{\n{css}\n}}"

@app.route('/', methods=['GET', 'POST'])
def index():
	if request.method == 'POST':
		if 'image' not in request.files:
			return jsonify({'error': 'No image uploaded'}), 400
		file = request.files['image']
		img_bytes = file.read()
		color_thief = ColorThief(io.BytesIO(img_bytes))
		palette = color_thief.get_palette(color_count=5)
		hex_palette = [rgb_to_hex(c) for c in palette]
		gradient = generate_gradient(palette)
		css = generate_css(palette)
		return jsonify({
			'palette': hex_palette,
			'gradient': gradient,
			'css': css
		})
	return render_template('index.html')

if __name__ == '__main__':
	app.run(debug=True)
