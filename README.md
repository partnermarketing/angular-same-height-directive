Same height directive
=====================

An Angular directive that keeps elements at the same height.

(This directive does not work in IE <= 8.)

[![Build Status](https://travis-ci.org/amyboyd/angular-same-height-directive.svg?branch=master)](https://travis-ci.org/amyboyd/angular-same-height-directive)

How to install
--------------

	npm install angular-same-height --save


How to use
----------

Format:

	same-height="MEDIA QUERY { SELECTOR } [, MEDIA QUERY { SELECTOR } ]"

If `MEDIA QUERY` is `*`, the elements found by `SELECTOR` are always kept at the same height.

Examples:

	<article same-height="(min-width: 901px) { h2 } screen and (min-width: 901px) { div p:nth-of-type(1) }">
		<div>
			<h1>Title 1</h1>
			<p>Paragraph 1</p>
		</div>

		<div>
			<h1>Title 2 <br /> Title 2</h1>
			<p>Paragraph 2 <br /> Paragraph 2</p>
			<p>Paragraph 3 (not kept the same height)</p>
		</div>
	</article>

	<ul same-height="* { li }">
		<li>Text</li>
		<li>Text<br />Text</li>
		<li>Text<br />Text<br />Text</li>
	</ul>

Running the tests
-----------------

	npm test
