install: dependencies build

build:
	gulp build --production

dependencies:
	bundle install
	npm install
	bower install

globals:
	npm install -g gulp
	npm install -g shipit-cli

circle: globals dependencies
	gulp circle --circle

safe: dependencies
	npm install gulp-imagemin
	npm install imagemin-pngquant
	gulp build --production

test:
	echo 'Not yet implemented'
