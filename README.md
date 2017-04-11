# jQuery Ryukyu Menu
A jQuery plugin to make responsive menu
## Using
Before your closing ```<body>``` tag add:<br>
```JavaScript
<script type="text/javascript" src="yourpath/jquery.min.js"></script>
<script type="text/javascript" src="yourpath/jquery.ryukyu.menu.min.js"></script>
```
Prepare html code like this
```html
<ul>
	<li>
		<a href="#">Menu 1</a>
		<ul>
			<li>
				<a href="#">Menu 1</a>
			</li>
			<li>
				<a href="#">Menu 2</a>
			</li>
			<li>
				<a href="#">Menu 3</a>
			</li>
			<li>
				<a href="#">Menu 4</a>
			</li>
		</ul>
	</li>
	<li>
		<a href="#">Menu 2</a>
	</li>
	<li>
		<a href="#">Menu 3</a>
	</li>
	<li>
		<a href="#">Menu 4</a>
	</li>
</ul>
```
### Example
Initialize with:
```JavaScript
$(element).ryukyumenu();
```
## Options
| Option  |Type   | Default  | Description  |
|---|---|---|---|
| addCloseButtonMobile  | boolean  |true   | add close button on mobile menu  |
| offsetTop  | interger  | 45  | distance between top and menu  |
| hamburgerClass  | string  | menu-icon  | add class for toogle menu button  |
|subHamburgerClass|string|sub-menu-icon|add class for toogle sub menu button|
|closeButtonClass|string|close-menu-icon|add class for mobile close button|

### Example
```JavaScript
$(element).ryukyumenu({
	addCloseButtonMobile: false,
	offsetTop: 50,
	hamburgerClass: 'ryukyu-menu-icon',
	subHamburgerClass: 'ryukyu-sub-menu-icon',
	closeButtonClass: 'ryukyu-close-icon'
});
```