<!DOCTYPE html>
<?php
	include 'lang/lang.php';
?>
<html>
<head>
	<meta charset="utf-8">
	<title>DRS Editor</title>
	<link rel="stylesheet" type="text/css" href="./bootstrap/css/bootstrap.min.css">
	<link rel="stylesheet" type="text/css" href="./jsonEditor/jsonEditor.min.css">
	<link rel="stylesheet" type="text/css" href="./jquery-ui/jquery-ui.min.css">
	<style type="text/css">
		body {
			background: #20262E;
			padding: 20px;
			font-family: 微軟正黑體,Helvetica;
			color: white;
		}

		html{
			margin: 0;
			padding: 0;
		}
		canvas{
			display: block;
			background: #777;
		}
		.menuarea,.editarea,.textarea{
			height: 94vh;
		}
		#editor{
			height: 85vh;
			width: 100%;
			background: #FFF;
		}
		.menuarea{
			text-align: right;
		}
		.darkchange{
			fill:currentColor;
		}
		.btn-svg{
			padding: 0.375rem 0.375rem;
			height: 38px;
		}
		.modal{
			color:black;
		}
		u{    
			border-bottom: 1px dotted #000;
			text-decoration: none;
		}
		#slider,#cvs{
			display: inline-block;/* */
		}
	</style>
	<script src="https://www.recaptcha.net/recaptcha/api.js" async defer></script>
</head>
	<body>
		<div class="container-fluid">
			<div class="row">
				<div class="col-md-4 menuarea overflow-auto">
					<h1><?= _BEAT ?></h1>
					<div class="btn-group" role="group" aria-label="min">
						<button type="button" class="btn btn-primary minbt">4</button>
						<button type="button" class="btn btn-light minbt">8</button>
						<button type="button" class="btn btn-light minbt">16</button>
						<button type="button" class="btn btn-light minbt">12</button>
					</div>
					<hr>
					<h1><?= _NEW ?></h1>
					<div class="btn-group" role="group" aria-label="width">
						<button type="button" class="btn btn-light tawbt"><?= _EASY ?>(6)</button>
						<button type="button" class="btn btn-primary tawbt"><?= _NORMAL ?>(5)</button>
					</div>
					<div class="btn-group" role="group" aria-label="tap">
						<button type="button" class="btn btn-warning tapbt">L</button>
						<button type="button" class="btn btn-primary tapbt">R</button>
					</div><br>
					<div class="btn-group" role="group" aria-label="hold">
						<button type="button" class="btn btn-success my-1 tonbt">TAP-ON</button>
						<button type="button" class="btn btn-success my-1 hldbt">HOLD-ON</button>
					</div>
					<br>
					<div class="btn-group" role="group" aria-label="once">
						<button type="button" class="btn btn-info dwnbt">DOWN</button>
						<button type="button" class="btn btn-info jmpbt">JUMP</button>
						<button type="button" class="btn btn-info sldbt">SLIDE</button>
					</div>
					<br>
					<div class="btn-group" role="group" aria-label="clradd">
						<button type="button" class="btn btn-danger clrbt my-1 btn-svg">
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
								<path fill="none" d="M0 0h24v24H0V0z"/>
								<path d="M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.89c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z" class="darkchange"/>
							</svg>
						</button>
					</div>
					<div class="btn-group" role="group" aria-label="newmeasure">
						<button type="button" class="btn btn-warning nmebt my-1"><?= _NEWMEASURE ?></button>
					</div>
					<h1><?= _EDIT ?></h1>
					<div class="btn-group" role="group" aria-label="edit">
						<button type="button" class="btn btn-primary edtbt btn-svg dsbbt" data='d'>
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
								<path fill="none" d="M0 0h24v24H0V0z"/>
								<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-4.42 3.58-8 8-8 1.85 0 3.55.63 4.9 1.69L5.69 16.9C4.63 15.55 4 13.85 4 12zm8 8c-1.85 0-3.55-.63-4.9-1.69L18.31 7.1C19.37 8.45 20 10.15 20 12c0 4.42-3.58 8-8 8z" class="darkchange"/>
							</svg>
						</button>
						<button type="button" class="btn btn-light edtbt btn-svg" data='x'>
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
								<path fill="none" d="M0 0h24v24H0V0z"/>
								<path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v10zM18 4h-2.5l-.71-.71c-.18-.18-.44-.29-.7-.29H9.91c-.26 0-.52.11-.7.29L8.5 4H6c-.55 0-1 .45-1 1s.45 1 1 1h12c.55 0 1-.45 1-1s-.45-1-1-1z" class="darkchange"/>
							</svg>
						</button>
					</div><br>
					<div class="btn-group my-1" role="group" aria-label="edit">
						<button type="button" class="btn btn-light edtbt btn-svg" data='n'>
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
								<path fill="none" d="M0 0h24v24H0V0z"/>
								<path d="M16 17.01V11c0-.55-.45-1-1-1s-1 .45-1 1v6.01h-1.79c-.45 0-.67.54-.35.85l2.79 2.78c.2.19.51.19.71 0l2.79-2.78c.32-.31.09-.85-.35-.85H16zM8.65 3.35L5.86 6.14c-.32.31-.1.85.35.85H8V13c0 .55.45 1 1 1s1-.45 1-1V6.99h1.79c.45 0 .67-.54.35-.85L9.35 3.35c-.19-.19-.51-.19-.7 0z" class="darkchange"/>
							</svg>
						</button>
						<button type="button" class="btn btn-light edtbt btn-svg" data='e'>
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
								<path fill="none" d="M0 0h24v24H0V0z"/>
								<path d="M6.14 11.86l-2.78 2.79c-.19.2-.19.51 0 .71l2.78 2.79c.31.32.85.09.85-.35V16H13c.55 0 1-.45 1-1s-.45-1-1-1H6.99v-1.79c0-.45-.54-.67-.85-.35zm14.51-3.21l-2.78-2.79c-.31-.32-.85-.09-.85.35V8H11c-.55 0-1 .45-1 1s.45 1 1 1h6.01v1.79c0 .45.54.67.85.35l2.78-2.79c.2-.19.2-.51.01-.7z" class="darkchange"/>
							</svg>
						</button>
						<button type="button" class="btn btn-light edtbt btn-svg" data='l'>
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
								<path opacity=".87" fill="none" d="M24 0v24H0V0h24z"/>
								<path d="M17.7 15.89L13.82 12l3.89-3.89c.39-.39.39-1.02 0-1.41-.39-.39-1.02-.39-1.41 0l-4.59 4.59c-.39.39-.39 1.02 0 1.41l4.59 4.59c.39.39 1.02.39 1.41 0 .38-.38.38-1.02-.01-1.4zM7 6c.55 0 1 .45 1 1v10c0 .55-.45 1-1 1s-1-.45-1-1V7c0-.55.45-1 1-1z" class="darkchange"/>
							</svg>
						</button>
						<button type="button" class="btn btn-light edtbt btn-svg" data='r'>
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
								<path opacity=".87" fill="none" d="M0 0h24v24H0V0z"/>
								<path d="M6.29 8.11L10.18 12l-3.89 3.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l4.59-4.59c.39-.39.39-1.02 0-1.41L7.7 6.7c-.39-.39-1.02-.39-1.41 0-.38.39-.38 1.03 0 1.41zM17 6c.55 0 1 .45 1 1v10c0 .55-.45 1-1 1s-1-.45-1-1V7c0-.55.45-1 1-1z" class="darkchange"/>
							</svg>
						</button>
					</div>
					<h5><?= _DELETEINFO ?></h5>
					<button type="button" class="btn btn-info infbt btn-svg" data-toggle="modal" data-target="#info">
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
							<path fill="none" d="M0 0h24v24H0V0z"/>
							<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 15c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1s1 .45 1 1v4c0 .55-.45 1-1 1zm1-8h-2V7h2v2z" class="darkchange"/>
						</svg><?= _INFO ?>
					</button>
				</div>
				<div class="col-md-4 overflow-hidden editarea">
					<canvas height=500 width=220 id='cvs'></canvas>
					<div id="slider"></div>
				</div>
				<div class="col-md-4 textarea">
					<div id="editor"></div>
					<br>
					<div class="btn-group" role="group" aria-label="redraw">
						<button type="button" class="btn btn-danger rdrbt btn-svg">
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
								<path fill="none" d="M0 0h24v24H0V0z"/>
								<path d="M17.65 6.35c-1.63-1.63-3.94-2.57-6.48-2.31-3.67.37-6.69 3.35-7.1 7.02C3.52 15.91 7.27 20 12 20c3.19 0 5.93-1.87 7.21-4.56.32-.67-.16-1.44-.9-1.44-.37 0-.72.2-.88.53-1.13 2.43-3.84 3.97-6.8 3.31-2.22-.49-4.01-2.3-4.48-4.52C5.31 9.44 8.26 6 12 6c1.66 0 3.14.69 4.22 1.78l-1.51 1.51c-.63.63-.19 1.71.7 1.71H19c.55 0 1-.45 1-1V6.41c0-.89-1.08-1.34-1.71-.71l-.64.65z" class="darkchange"/>
							</svg>
						</button>
					</div>
					<div class="btn-group" role="group" aria-label="upload">
						<button type="button" class="btn btn-success btn-svg" data-toggle="modal" data-target="#upload">
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
								<path fill="none" d="M0 0h24v24H0V0z"/>
								<path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l4.65-4.65c.2-.2.51-.2.71 0L17 13h-3z" class="darkchange"/>
							</svg>
						</button>
					</div>
				</div>
			</div>
		</div>
		<div class="modal fade" id="upload" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
			<div class="modal-dialog" role="document">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title" id="exampleModalLabel"><?= _UPLOAD ?></h5>
						<button type="button" class="close" data-dismiss="modal" aria-label="Close">
							<span aria-hidden="true">&times;</span>
						</button>
					</div>
					<div class="modal-body">
						<input type="text" class="form-control" id="fn" value="" placeholder="<?= _ULPLACEHOLDER ?>"><br>
						<div class="g-recaptcha" data-sitekey="6LcDXL4UAAAAANw3srDfU0FsZ39DKC7hy6NoRQMj"></div>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-primary" id="submit" data-dismiss="modal"><?= _SEND ?></button>
					</div>
				</div>
			</div>
		</div>
		<div class="modal fade" id="info" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
			<div class="modal-dialog" role="document">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title" id="exampleModalLabel"><?= _INFO ?></h5>
						<button type="button" class="close" data-dismiss="modal" aria-label="Close">
							<span aria-hidden="true">&times;</span>
						</button>
					</div>
					<div class="modal-body">
						<div class="tabbable" id="list">
							<ul class="nav nav-tabs">
								<li class="nav-item">
									<a class="nav-link active" href="#infobeat" data-toggle="tab"><?= _BEAT ?></a>
								</li>
								<li class="nav-item">
									<a class="nav-link" href="#infonew" data-toggle="tab"><?= _NEW ?></a>
								</li>
								<li class="nav-item">
									<a class="nav-link" href="#infoedit" data-toggle="tab"><?= _EDIT ?></a>
								</li>
								<li class="nav-item">
									<a class="nav-link" href="#infoother" data-toggle="tab"><?= _OTHER ?></a>
								</li>
							</ul>
							<div class="tab-content">
								<div class="tab-pane active" id="infobeat">
									<h5><?= _INFOBEATTITLE ?></h5>
									<p><?= _INFOBEAT ?></p>
								</div>
								<div class="tab-pane" id="infonew">
									<div class="tabbable" id="newlist">
										<ul class="nav nav-tabs">
											<li class="nav-item">
												<a href="#newwidth" class="nav-link active" data-toggle="tab"><?= _WIDTH ?></a>
											</li>
											<li class="nav-item">
												<a href="#newlr" class="nav-link" data-toggle="tab">L/R</a>
											</li>
											<li class="nav-item">
												<a href="#newtap" class="nav-link" data-toggle="tab">TAP</a>
											</li>
											<li class="nav-item">
												<a href="#newhold" class="nav-link" data-toggle="tab">HOLD</a>
											</li>
											<li class="nav-item">
												<a href="#newslide" class="nav-link" data-toggle="tab">SLIDE</a>
											</li>
											<li class="nav-item">
												<a href="#newdown" class="nav-link" data-toggle="tab">DOWN</a>
											</li>
											<li class="nav-item">
												<a href="#newjump" class="nav-link" data-toggle="tab">JUMP</a>
											</li>
											<li class="nav-item">
												<a href="#newx" class="nav-link" data-toggle="tab">X</a>
											</li>
											<li class="nav-item">
												<a href="#newme" class="nav-link" data-toggle="tab"><?= _NEWMEASURE ?></a>
											</li>
										</ul>
										<div class="tab-content">
											<div class="tab-pane active" id="newwidth">
												<h5><?= _WIDTH ?></h5>
												<p><?= _NEWWIDTH ?></p>
											</div>
											<div class="tab-pane" id="newlr">
												<h5>L/R</h5>
												<p><?= _NEWLR ?></p>
											</div>
											<div class="tab-pane" id="newtap">
												<h5>TAP</h5>
												<p><?= _NEWTAP ?></p>
											</div>
											<div class="tab-pane" id="newhold">
												<h5>HOLD</h5>
												<p><?= _NEWHOLD ?></p>
											</div>
											<div class="tab-pane" id="newslide">
												<h5>SLIDE</h5>
												<p><?= _NEWSLIDE ?></p>
											</div>
											<div class="tab-pane" id="newdown">
												<h5>DOWN</h5>
												<p><?= _NEWDOWN ?></p>
											</div>
											<div class="tab-pane" id="newjump">
												<h5>JUMP</h5>
												<p><?= _NEWJUMP ?></p>
											</div>
											<div class="tab-pane" id="newx">
												<h5><?= _NEWXTITLE ?>
													<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
														<path fill="none" d="M0 0h24v24H0V0z"/>
														<path d="M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.89c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z" class="darkchange"/>
													</svg>
												</h5>
												<p><?= _NEWX ?></p>
											</div>
											<div class="tab-pane" id="newme">
												<h5><?= _NEWMEASURE ?></h5>
												<p><?= _NEWME ?></p>
											</div>
										</div>
									</div>
								</div>
								<div class="tab-pane" id="infoedit">
									<div class="tabbable" id="editlist">
										<ul class="nav nav-tabs">
											<li class="nav-item">
												<a href="#editnone" class="nav-link active" data-toggle="tab"><?= _EDITNONETITLE ?></a>
											</li>
											<li class="nav-item">
												<a href="#editrem" class="nav-link" data-toggle="tab"><?= _EDITREMOVETITLE ?></a>
											</li>
											<li class="nav-item">
												<a href="#editn" class="nav-link" data-toggle="tab"><?= _EDITNTITLE ?></a>
											</li>
											<li class="nav-item">
												<a href="#edite" class="nav-link" data-toggle="tab"><?= _EDITETITLE ?></a>
											</li>
											<li class="nav-item">
												<a href="#editl" class="nav-link" data-toggle="tab"><?= _EDITLTITLE ?></a>
											</li>
											<li class="nav-item">
												<a href="#editr" class="nav-link" data-toggle="tab"><?= _EDITRTITLE ?></a>
											</li>
										</ul>
										<div class="tab-content">
											<div class="tab-pane active" id="editnone">
												<h5><?= _EDITNONETITLE ?>
													<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
														<path fill="none" d="M0 0h24v24H0V0z"/>
														<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-4.42 3.58-8 8-8 1.85 0 3.55.63 4.9 1.69L5.69 16.9C4.63 15.55 4 13.85 4 12zm8 8c-1.85 0-3.55-.63-4.9-1.69L18.31 7.1C19.37 8.45 20 10.15 20 12c0 4.42-3.58 8-8 8z" class="darkchange"/>
													</svg>
												</h5>
												<p><?= _EDITNONE ?></p>
											</div>
											<div class="tab-pane" id="editrem">
												<h5><?= _EDITREMOVETITLE ?>
													<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
														<path fill="none" d="M0 0h24v24H0V0z"/>
														<path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v10zM18 4h-2.5l-.71-.71c-.18-.18-.44-.29-.7-.29H9.91c-.26 0-.52.11-.7.29L8.5 4H6c-.55 0-1 .45-1 1s.45 1 1 1h12c.55 0 1-.45 1-1s-.45-1-1-1z" class="darkchange"/>
													</svg>
												</h5>
												<p><?= _EDITREMOVE ?></p>
											</div>
											<div class="tab-pane" id="editn">
												<h5><?= _EDITNTITLE ?>
													<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
														<path fill="none" d="M0 0h24v24H0V0z"/>
														<path d="M16 17.01V11c0-.55-.45-1-1-1s-1 .45-1 1v6.01h-1.79c-.45 0-.67.54-.35.85l2.79 2.78c.2.19.51.19.71 0l2.79-2.78c.32-.31.09-.85-.35-.85H16zM8.65 3.35L5.86 6.14c-.32.31-.1.85.35.85H8V13c0 .55.45 1 1 1s1-.45 1-1V6.99h1.79c.45 0 .67-.54.35-.85L9.35 3.35c-.19-.19-.51-.19-.7 0z" class="darkchange"/>
													</svg>
												</h5>
												<p><?= _EDITN ?></p>
											</div>
											<div class="tab-pane" id="edite">
												<h5><?= _EDITETITLE ?>
													<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
														<path fill="none" d="M0 0h24v24H0V0z"/>
														<path d="M6.14 11.86l-2.78 2.79c-.19.2-.19.51 0 .71l2.78 2.79c.31.32.85.09.85-.35V16H13c.55 0 1-.45 1-1s-.45-1-1-1H6.99v-1.79c0-.45-.54-.67-.85-.35zm14.51-3.21l-2.78-2.79c-.31-.32-.85-.09-.85.35V8H11c-.55 0-1 .45-1 1s.45 1 1 1h6.01v1.79c0 .45.54.67.85.35l2.78-2.79c.2-.19.2-.51.01-.7z" class="darkchange"/>
													</svg>
												</h5>
												<p><?= _EDITE ?></p>
											</div>
											<div class="tab-pane" id="editl">
												<h5><?= _EDITLTITLE ?>
													<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
														<path opacity=".87" fill="none" d="M24 0v24H0V0h24z"/>
														<path d="M17.7 15.89L13.82 12l3.89-3.89c.39-.39.39-1.02 0-1.41-.39-.39-1.02-.39-1.41 0l-4.59 4.59c-.39.39-.39 1.02 0 1.41l4.59 4.59c.39.39 1.02.39 1.41 0 .38-.38.38-1.02-.01-1.4zM7 6c.55 0 1 .45 1 1v10c0 .55-.45 1-1 1s-1-.45-1-1V7c0-.55.45-1 1-1z" class="darkchange"/>
													</svg>
												</h5>
												<p><?= _EDITL ?></p>
											</div>
											<div class="tab-pane" id="editr">
												<h5><?= _EDITRTITLE ?>
													<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
														<path opacity=".87" fill="none" d="M0 0h24v24H0V0z"/>
														<path d="M6.29 8.11L10.18 12l-3.89 3.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l4.59-4.59c.39-.39.39-1.02 0-1.41L7.7 6.7c-.39-.39-1.02-.39-1.41 0-.38.39-.38 1.03 0 1.41zM17 6c.55 0 1 .45 1 1v10c0 .55-.45 1-1 1s-1-.45-1-1V7c0-.55.45-1 1-1z" class="darkchange"/>
													</svg>
												</h5>
												<p><?= _EDITR ?></p>
											</div>
										</div>
									</div>
								</div>
								<div class="tab-pane" id="infoother">
									<h5><?= _REDRAWTITLE ?>
										<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
											<path fill="none" d="M0 0h24v24H0V0z"/>
											<path d="M17.65 6.35c-1.63-1.63-3.94-2.57-6.48-2.31-3.67.37-6.69 3.35-7.1 7.02C3.52 15.91 7.27 20 12 20c3.19 0 5.93-1.87 7.21-4.56.32-.67-.16-1.44-.9-1.44-.37 0-.72.2-.88.53-1.13 2.43-3.84 3.97-6.8 3.31-2.22-.49-4.01-2.3-4.48-4.52C5.31 9.44 8.26 6 12 6c1.66 0 3.14.69 4.22 1.78l-1.51 1.51c-.63.63-.19 1.71.7 1.71H19c.55 0 1-.45 1-1V6.41c0-.89-1.08-1.34-1.71-.71l-.64.65z" class="darkchange"/>
										</svg>
									</h5>
									<p><?= _REDRAW ?></p>
									<h5><?= _UPLOAD ?>
										<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
											<path fill="none" d="M0 0h24v24H0V0z"/>
											<path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l4.65-4.65c.2-.2.51-.2.71 0L17 13h-3z" class="darkchange"/>
										</svg>
									</h5>
									<p><?= _UPLOADINFO ?></p>
								</div>
							</div>
						</div>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-primary" data-dismiss="modal"><?= _CLOSE ?></button>
					</div>
				</div>
			</div>
		</div>
		<script type="text/javascript" src="./EaselJS/lib/easeljs.min.js"></script>
		<script type="text/javascript" src="./jquery-3.4.1.min.js"></script>
		<script type="text/javascript" src="./bootstrap/js/bootstrap.min.js"></script>
		<script type="text/javascript" src="./jsonEditor/jsonEditor.min.js"></script>
		<script type="text/javascript" src="./jquery-ui/jquery-ui.min.js"></script>
		<script type="text/javascript">
		var editor=new JSONEditor(document.getElementById("editor"),{mode:"code"});
		var score=[
			//{type:"tap",time:{int:1,num:1,den:4},lr:"L",width:[3,7]},
			{type:"tap",time:{int:2,num:1,den:4},lr:"R",width:[10,14]},
			{type:"tap",time:{int:2,num:2,den:4},lr:"L",width:[3,7]},
			{type:"tap",time:{int:2,num:3,den:4},lr:"R",width:[10,14]},
			{type:"tap",time:{int:2,num:4,den:4},lr:"L",width:[3,7]}
		];

		var cvs=document.getElementById('cvs');
		var stage=new createjs.Stage(cvs);
		var ct=10;
		var maxme=score[score.length-1].time.int;
		var mh=500;	
		cvs.height=($(window).height()-parseInt(window.getComputedStyle(document.getElementsByTagName("body")[0]).getPropertyValue('padding-top'))-parseInt(window.getComputedStyle(document.getElementsByTagName("body")[0]).getPropertyValue('padding-bottom')));
		var ch=maxme*mh;
		var cw=cvs.width-20;
		var update=false;
		var rebuild=false;
		var min=4;
		var hlock=[false,false];
		var addtap=false;
		var addtype="R";
		var addwid=5;
		var addhld={start:false,clicked:false,prev:null};
		var addsld={start:false,clicked:false,prev:null,washold:false};
		var	adddwn=false;
		var addjmp=false;
		var edit="d";
		var sliderY=0;
		var dummy=new createjs.Shape();

		var lcolor="#FFAA33";
		var rcolor="#66CCFF";
		var lholdc="#EE9922";
		var rholdc="#55BBEE";
		var jumpco="#88DDFF";
		var downco="#FFFF88";

		var newtap=function(x){
			var tap=new createjs.Shape();
			tap.graphics.f((x.lr=="L")?lcolor:rcolor).rr(
				((x.width[0]-1)*(cw/16)),
				(mh*(maxme-x.time.int+1)-((x.time.num-1)*mh/x.time.den)-ct),
				((x.width[1]-x.width[0]+1)*(cw/16)),
				ct,
				2
			);

			tap.on("mouseover", function (evt){
				if(edit=="n")
					tap.cursor="n-resize";
				else if((addhld.start&&!addhld.clicked)||edit=="x")
					tap.cursor="pointer";
				else if(edit=="d")
					tap.cursor="default";
				else
					tap.cursor="e-resize";
			});

			tap.on("mousedown", function (evt) {
				this.parent.addChild(this);
				var dummyY=evt.stageY+sliderY;
				this.offset = {x: this.x - evt.stageX, y: this.y - dummyY,px:Math.round(evt.stageX*16/cw)-x.width[0]};
				if(addhld.start&&!addhld.clicked){
					addhld.clicked=true;
					addhld.prev=x;
				}	
			});

			tap.on("pressmove", function (evt) {
				if(edit=="l"){
					var left=Math.round(evt.stageX*16/cw);
					if(left>=17)left--;
					if(left<=0)left++;
					if(left>=x.width[1])left=x.width[1]-1;
					x.width[0]=left;
					evt.target.graphics.command.x=(left-1)*cw/16;
					evt.target.graphics.command.w=((x.width[1]-x.width[0]+1)*(cw/16));
				}else if(edit=="r"){
					var right=Math.round(evt.stageX*16/cw);
					if(right>=17)right--;
					if(right<=0)right++;
					if(right<=x.width[0])right=x.width[0]+1;
					x.width[1]=right;
					evt.target.graphics.command.w=((x.width[1]-x.width[0]+1)*(cw/16));
				}else if(edit=="e"){
					var left=Math.round(evt.stageX*16/cw);
					var width=x.width[1]-x.width[0];
					if(left>=17-width)left=16-width;
					if(left<=0)left=1;
					x.width=[left,left+width];
					evt.target.graphics.command.x=(left-1)*cw/16;
				}else if(edit=="n"){
					var dummyY=evt.stageY+sliderY;
					var time=Math.ceil((dummyY==0?1:dummyY)*min/mh);
					x.time={int:maxme-Math.floor((time-1)/min),num:(min-time%min)%min+1,den:min};
					evt.target.y = time*mh/min+Math.floor(this.offset.y*min/mh)*mh/min;
				}
				update = true;
			});

			tap.on("dblclick",function(evt){
				if(edit=="x"){
					remove(x);
					stage.removeChild(tap);
					update = true;
				}
			});

			stage.addChild(tap);
			update=true;
		};

		var newhold=function(x,prev){
			var hold=new createjs.Shape();
			hold.compositeOperation="destination-over";
			hold.graphics.f((x.lr=="L")?lholdc:rholdc)
			.moveTo((prev.width[0]*2-1)*(cw/32),
				(mh*(maxme-prev.time.int+1)-(prev.time.num-1)*mh/prev.time.den))
			.lineTo((prev.width[1]*2-1)*(cw/32),
				(mh*(maxme-prev.time.int+1)-(prev.time.num-1)*mh/prev.time.den))
			.lineTo((x.width[1]*2-1)*(cw/32),
				(mh*(maxme-x.time.int+1)-(x.time.num-1)*mh/x.time.den))
			.lineTo((x.width[0]*2-1)*(cw/32),
				(mh*(maxme-x.time.int+1)-(x.time.num-1)*mh/x.time.den))
			.closePath();

			hold.on("mouseover", function (evt){
				if(edit=="n")
					hold.cursor="n-resize";
				else if((addhld.start&&!addhld.clicked)||(addsld.start&&!addsld.clicked)||(edit==
					"x"))
					hold.cursor="pointer";
				else if(edit=="d")
					hold.cursor="default";
				else
					hold.cursor="e-resize";
			});

			hold.on("mousedown", function (evt) {
				this.parent.addChild(this);
				var dummyY=evt.stageY+sliderY;
				this.offset = {x: this.x - evt.stageX, y: this.y - dummyY};
				if(addhld.start&&!addhld.clicked){
					addhld.clicked=true;
					addhld.prev=x;
				}else if(addsld.start&&!addsld.clicked){
					addsld.clicked=true;
					addsld.prev=x;
				}
			});

			hold.on("pressmove", function (evt) {
				if(edit=="l"){
					var left=Math.round(evt.stageX*16/cw);
					if(left>=17)left--;
					if(left<=0)left++;
					if(left>=x.width[1])left=x.width[1]-1;
					x.width[0]=left;
				}else if(edit=="r"){
					var right=Math.round(evt.stageX*16/cw);
					if(right>=17)right--;
					if(right<=0)right++;
					if(right<=x.width[0])right=x.width[0]+1;
					x.width[1]=right;
				}else if(edit=="e"){
					var left=Math.round(evt.stageX*16/cw);
					var width=x.width[1]-x.width[0];
					if(left>=17-width)left=16-width;
					if(left<=0)left=1;
					x.width=[left,left+width];
				}else if(edit=="n"){
					var dummyY=evt.stageY+sliderY;
					var time=Math.ceil((dummyY==0?1:dummyY)*min/mh);
					x.time={int:maxme-Math.floor((time-1)/min),num:(min-time%min)%min+1,den:min};
				}
				hold.graphics.c().f((x.lr=="L")?lholdc:rholdc)
				.moveTo((prev.width[0]*2-1)*(cw/32),
					(mh*(maxme-prev.time.int+1)-(prev.time.num-1)*mh/prev.time.den))
				.lineTo((prev.width[1]*2-1)*(cw/32),
					(mh*(maxme-prev.time.int+1)-(prev.time.num-1)*mh/prev.time.den))
				.lineTo((x.width[1]*2-1)*(cw/32),
					(mh*(maxme-x.time.int+1)-(x.time.num-1)*mh/x.time.den))
				.lineTo((x.width[0]*2-1)*(cw/32),
					(mh*(maxme-x.time.int+1)-(x.time.num-1)*mh/x.time.den))
				.closePath();
				update = true;
			});

			hold.on("dblclick",function(evt){
				if(edit=="x"){
					remove(x);
					stage.removeChild(hold);
					update = true;
				}
			});

			stage.addChild(hold);
			update=true;
		};

		var newslide=function(x,prev){
			var slide=new createjs.Shape();
			slide.graphics.f((x.lr=="L")?lcolor:rcolor).r(
				(x.from[0]*2-1)*(cw/32),
				mh*(maxme-prev.time.int+1)-(prev.time.num-1)*mh/x.time.den-ct*2,
				(x.from[1]-x.from[0])*(cw/16),
				ct*2
			);

			slide.on("mouseover", function (evt){
				if(edit=="n")
					slide.cursor="n-resize";
				else if((addhld.start&&!addhld.clicked)||(edit=="x"))
					slide.cursor="pointer";
				else if(edit=="d")
					slide.cursor="default";
				else
					slide.cursor="e-resize";
			}); 

			slide.on("mousedown", function (evt) {
				this.parent.addChild(this);
				var dummyY=evt.stageY+sliderY;
				this.offset = {x: this.x - evt.stageX, y: this.y - dummyY};
				if(addhld.start&!addhld.clicked){
					addhld.clicked=true;
					addhld.prev=x;
				}	
			});

			slide.on("pressmove", function (evt) {
				if(edit=="l"){
					var left=Math.round(evt.stageX*16/cw);
					if(left>=17)left--;
					if(left<=0)left++;
					if(left>=x.width[1])left=x.width[1]-1;
					x.width[0]=left;
				}else if(edit=="r"){
					var right=Math.round(evt.stageX*16/cw);
					if(right>=17)right--;
					if(right<=0)right++;
					if(right<=x.width[0])right=x.width[0]+1;
					x.width[1]=right;
				}else if(edit=="e"){
					var left=Math.round(evt.stageX*16/cw);
					var width=x.width[1]-x.width[0];
					if(left>=17-width)left=16-width;
					if(left<=0)left=1;
					x.width=[left,left+width];
				}else if(edit=="n"){
					var dummyY=evt.stageY+sliderY;
					var time=Math.ceil((dummyY==0?1:dummyY)*min/mh);
					x.time={int:maxme-Math.floor((time-1)/min),num:(min-time%min)%min+1,den:min};
				}
				slide.graphics.c().f((x.lr=="L")?lholdc:rholdc)
				.moveTo((prev.width[0]*2-1)*(cw/32),
					(mh*(maxme-prev.time.int+1)-(prev.time.num-1)*mh/prev.time.den))
				.lineTo((prev.width[1]*2-1)*(cw/32),
					(mh*(maxme-prev.time.int+1)-(prev.time.num-1)*mh/prev.time.den))
				.lineTo((x.width[1]*2-1)*(cw/32),
					(mh*(maxme-x.time.int+1)-(x.time.num-1)*mh/x.time.den))
				.lineTo((x.width[0]*2-1)*(cw/32),
					(mh*(maxme-x.time.int+1)-(x.time.num-1)*mh/x.time.den))
				.closePath();
				update = true;
			});

			slide.on("dblclick",function(evt){
				if(edit=="x"){
					remove(x);
					stage.removeChild(slide);
					update = true;
				}
			});

			stage.addChild(slide);
			update=true;
		};

		var newdown=function(x,prev){
			var down=new createjs.Shape();
			down.compositeOperation="destination-over";
			down.graphics.f(downco).r(
				0,
				mh*(maxme-x.time.int+1)-(x.time.num-1)*mh/x.time.den-ct/4*3,
				cw-1,
				ct/4*3
			);

			down.on("mouseover",function(evt){
				if(edit=="n")
					down.cursor="n-resize";
				else if(edit=="x")
					down.cursor="pointer";
				else
					down.cursor="default";
			});

			down.on("mousedown",function(evt){
				this.parent.addChild(this);
				var dummyY=evt.stageY+sliderY;
				this.offset = {x: this.x - evt.stageX, y: this.y - dummyY};
			});

			down.on("pressmove",function(evt){
				if(edit=="n"){
					var dummyY=evt.stageY+sliderY;
					var time=Math.ceil((dummyY==0?1:dummyY)*min/mh);
					x.time={int:maxme-Math.floor((time-1)/min),num:(min-time%min)%min+1,den:min};
					evt.target.y = time*mh/min+Math.floor(this.offset.y*min/mh)*mh/min;
				}
				update = true;
			});

			down.on("dblclick",function(evt){
				if(edit=="x"){
					remove(x);
					stage.removeChild(down);
					update = true;
				}
			});

			stage.addChild(down);
		};

		var newjump=function(x,prev){
			var jump=new createjs.Shape();
			jump.compositeOperation="destination-over";
			jump.graphics.f(jumpco).r(
				0,
				mh*(maxme-x.time.int+1)-(x.time.num-1)*mh/x.time.den-ct/4*3,
				cw-1,
				ct/4*3
			);

			jump.on("mouseover",function(evt){
				if(edit=="n")
					jump.cursor="n-resize";
				else if(edit=="x")
					jump.cursor="pointer";
				else
					jump.cursor="default";
			});

			jump.on("mousedown",function(evt){
				this.parent.addChild(this);
				var dummyY=evt.stageY+sliderY;
				this.offset = {x: this.x - evt.stageX, y: this.y - dummyY};
			});

			jump.on("pressmove",function(evt){
				if(edit=="n"){
					var dummyY=evt.stageY+sliderY;
					var time=Math.ceil((dummyY==0?1:dummyY)*min/mh);
					x.time={int:maxme-Math.floor((time-1)/min),num:(min-time%min)%min+1,den:min};
					evt.target.y = time*mh/min+Math.floor(this.offset.y*min/mh)*mh/min;
				}
				update = true;
			});

			jump.on("dblclick",function(evt){
				if(edit=="x"){
					remove(x);
					stage.removeChild(jump);
					update = true;
				}
			});

			stage.addChild(jump);
		};

		var tc=function(a){
			return a.time.int+(a.time.num-1)/a.time.den;
		};

		var search=function(x){
			if(typeof x == "undefined"){
				console.log("undefined in search!");
				return [-1,-2];
			}
			var tcx=tc(x);
			if(x.type=="hold"||x.type=="slide"){
				for(i=0;i<score.length;i++){
					if(tc(score[i])>tcx)break;
					if(typeof score[i].hold !== "undefined"){
						var l= 0;
						var r= (score[i].hold.length-1);
						while(l<=r){
							var m= Math.floor((l+r)/2);
							var tcm=tc(score[i].hold[m]);
							if(tcm<tcx)
								l=m+1;
							else if(tcm>tcx)
								r=m-1;
							else{
								if(score[i].hold[m]==x)return [i,m];
								if(score[i].hold[m+1]==x)return [i,m+1];
								if(score[i].hold[m-1]==x)return [i,m-1];
								break;
							}
						}
					}
				}
				return [-1,-1];
			}
			var l= 0;
			var r= (score.length-1);
			while(l<=r){
				var m= Math.floor((l+r)/2);
				var tcm=tc(score[m]);
				if(tcm<tcx)
					l=m+1;
				else if(tcm>tcx)
					r=m-1;
				else{
					if(score[m]==x)return [m,-1];
					if(score[m+1]==x)return [m+1,-1];
					if(score[m-1]==x)return [m-1,-1];
					return [-1,-1];
				}
			}
			return [-1,-1];
		};

		var insert=function(x,prev=null){
			var tcx=tc(x);
			if(x.type=="hold"||x.type=="slide"){
				var rp=search(prev);
				if(rp[0]>=0){
					if(typeof score[rp[0]].hold == "undefined"){
						score[rp[0]].hold=[x];
						return;
					}
					score[rp[0]].hold.splice(rp[1]+1,0,x);
				}
			}else{
				var l= 0;
				var r= score.length;
				while(r>l){
					var m= (l+r)>>>1;
					var tcm=tc(score[m]);
					if(tcm<tcx)
						l=m+1;
					else
						r=m;
				}
				while(typeof score[l] != "undefined"){
					if(tc(score[l])==tcx)
						l++;
					else
						break;
				}
				score.splice(l,0,x);
			}
		};

		var remove=function(x){
			var r=search(x);
			if(r[1]>=0){
				if(score[r[0]].hold.length==1)
					delete score[r[0]].hold;
				else
					score[r[0]].hold.splice(r[1],1);
			}else if(r[0]>=0){
				score.splice(r[0],1);
			}
		};

		var redraw=function(){
			score.forEach(function(x){
				if(x.type=="tap"){
					newtap(x);
					if(typeof x.hold != "undefined"){
						var prev=x;
						x.hold.forEach(function(y){
							if(y.type=="hold"){
								newhold(y,prev);
							}else if(y.type=="slide"){
								newslide(y,prev);
							}
							prev=y;
						});
					}
				}else if(x.type=="down"){
					newdown(x);
				}else if(x.type=="jump"){
					newjump(x);
				}
			});
			stage.addChild(dummy);

			var ml=new createjs.Shape();
			ml.compositeOperation="destination-over";
			for(i=1;i<17;i++)
				ml.graphics.f("rgba(255,255,"+(i%4?255:0)+",0.1)").r(cw*i/16,0,i%4?1:2,ch-1);

			for(i=0;i<maxme*8;i++)
				ml.graphics.f("#"+(i%2?"6688FF20":"FF443340")).r(0,mh*(maxme-(i/8))-2,cw+19,2);

			stage.addChild(ml);

			for(i=0;i<maxme;i++){
				var label = new createjs.Text(i, "bold 14px Arial", "#FFFFFF");
				label.textAlign = "left";
				label.x = 202;
				label.textBaseline="bottom";
				label.y = mh*(maxme-i)-2;
				stage.addChild(label);
			}

		}

		redraw();

		//================================measure line
		
		stage.enableMouseOver();

		var tick=function(event) {
			// this set makes it so the stage only re-renders when an event handler indicates a change has happened.
			if (update) {
				update = false; // only update once
				stage.update(event);
				editor.set(score);
			}else if(rebuild){
				rebuild= false; // only update once
				stage.removeAllChildren();
				score=editor.get();
				redraw();
			}
		}
		createjs.Ticker.addEventListener("tick",tick);
		update=true;

		//=================stage controll

		stage.on("stagemousemove",function(evt){
			dummy.graphics.c();
			if(addtap){
				//Since I use a slider for transform(), mouseY should be re-calculated.
				var place=Math.round(evt.stageX*16/cw);
				var dummyY=evt.stageY+sliderY;
				var time=Math.ceil((dummyY==0?1:dummyY)*min/mh);
				if(place>(17-addwid))place=(17-addwid);
				if(place<1)place=1;
				var x={
					type:"tap",
					time:{int:maxme-Math.floor((time-1)/min),num:(min-time%min)%min+1,den:min},
					lr:addtype,
					width:[place,place+(addwid-1)]
				};
				dummy.compositeOperation="source-over";
				dummy.graphics.f((x.lr=="L")?lcolor+"80":rcolor+"80").rr(
					((x.width[0]-1)*(cw/16)),
					(mh*(maxme-x.time.int+1)-((x.time.num-1)*mh/x.time.den)-ct),
					((x.width[1]-x.width[0]+1)*(cw/16)),
					ct,
					2
				);
			}else if(addsld.clicked){
				var place=Math.round(evt.stageX*16/cw);
				var dummyY=evt.stageY+sliderY;
				var time=Math.ceil((dummyY==0?1:dummyY)*min/mh);
				if(place>16)place=(16);
				if(place<1)place=1;
				var pwidth=addhld.prev.width[1]-addhld.prev.width[0];
				var left=(place<addhld.prev.width[0])?place:(place>addhld.prev.width[1]?place-pwidth:addhld.prev.width[0]);
				var right=(place<addhld.prev.width[0])?(place+pwidth):(place>addhld.prev.width[1]?place:addhld.prev.width[1]);
				var x={
					type:"slide",
					width:[left,right],
					from:[],
					lr:addsld.prev.lr
				};
				x.from=[(x.width[0]<addsld.prev.width[0])?x.width[0]:addsld.prev.width[0],x.width[1]>addsld.prev.width[1]?x.width[1]:addsld.prev.width[1]];
				dummy.compositeOperation="source-over";
				dummy.graphics.f((x.lr=="L")?lcolor+"80":rcolor+"80	").r(
					(x.from[0]*2-1)*(cw/32),
					mh*(maxme-addsld.prev.time.int+1)-(addsld.prev.time.num-1)*mh/addsld.prev.time.den-ct*2,
					(x.from[1]-x.from[0])*(cw/16),
					ct*2
				);
			}else if(addhld.clicked){
				var place=Math.round(evt.stageX*16/cw);
				var dummyY=evt.stageY+sliderY;
				var time=Math.ceil((dummyY==0?1:dummyY)*min/mh);
				if(place>16)place=(16);
				if(place<1)place=1;
				var pwidth=addhld.prev.width[1]-addhld.prev.width[0];
				var left=(place<addhld.prev.width[0])?place:(place>addhld.prev.width[1]?place-pwidth:addhld.prev.width[0]);
				var right=(place<addhld.prev.width[0])?(place+pwidth):(place>addhld.prev.width[1]?place:addhld.prev.width[1]);
				var x={
					type:"hold",
					time:{int:maxme-Math.floor((time-1)/min),num:(min-time%min)%min+1,den:min},
					width:[left,right],
					lr:addhld.prev.lr
				};
				dummy.compositeOperation="destination-over";
				dummy.graphics.f((x.lr=="L")?lholdc+"80":rholdc+"80")
					.moveTo((addhld.prev.width[0]*2-1)*(cw/32),
						(mh*(maxme-addhld.prev.time.int+1)-(addhld.prev.time.num-1)*mh/addhld.prev.time.den))
					.lineTo((addhld.prev.width[1]*2-1)*(cw/32),
						(mh*(maxme-addhld.prev.time.int+1)-(addhld.prev.time.num-1)*mh/addhld.prev.time.den))
					.lineTo((x.width[1]*2-1)*(cw/32),
						(mh*(maxme-x.time.int+1)-(x.time.num-1)*mh/x.time.den))
					.lineTo((x.width[0]*2-1)*(cw/32),
						(mh*(maxme-x.time.int+1)-(x.time.num-1)*mh/x.time.den))
					.closePath();
			}else if(adddwn){
				var dummyY=evt.stageY+sliderY;
				var time=Math.ceil((dummyY==0?1:dummyY)*min/mh);
				var x={
					type:"down",
					time:{int:maxme-Math.floor((time-1)/min),num:(min-time%min)%min+1,den:min}
				};
				dummy.compositeOperation="destination-over";
				dummy.graphics.f(downco+"80").r(
					0,
					mh*(maxme-x.time.int+1)-(x.time.num-1)*mh/x.time.den-ct/4*3,
					cw-1,
					ct/4*3
				);
			}else if(addjmp){
				var dummyY=evt.stageY+sliderY;
				var time=Math.ceil((dummyY==0?1:dummyY)*min/mh);
				var x={
					type:"jump",
					time:{int:maxme-Math.floor((time-1)/min),num:(min-time%min)%min+1,den:min}
				};
				dummy.compositeOperation="destination-over";
				dummy.graphics.f(jumpco+"80").r(
					0,
					mh*(maxme-x.time.int+1)-(x.time.num-1)*mh/x.time.den-ct/4*3,
					cw-1,
					ct/4*3
				);
			}
			update=true;
		});

		stage.on("stagemousedown",function(evt){
			if(addtap){
				var place=Math.round(evt.stageX*16/cw);
				var dummyY=evt.stageY+sliderY;
				var time=Math.ceil((dummyY==0?1:dummyY)*min/mh);
				if(place>(17-addwid))place=(17-addwid);
				if(place<1)place=1;
				var x={
					type:"tap",
					time:{int:maxme-Math.floor((time-1)/min),num:(min-time%min)%min+1,den:min},
					lr:addtype,
					width:[place,place+(addwid-1)]
				};
				dummy.graphics.c();
				insert(x);
				newtap(x);
			}else if(addsld.clicked){
				addsld.clicked=false;
				addsld.start=false;
				var place=Math.round(evt.stageX*16/cw);
				var dummyY=evt.stageY+sliderY;
				var time=Math.ceil((dummyY==0?1:dummyY)*min/mh);
				if(place>16)place=(16);
				if(place<1)place=1;
				var pwidth=addhld.prev.width[1]-addhld.prev.width[0];
				var left=(place<addhld.prev.width[0])?place:(place>addhld.prev.width[1]?place-pwidth:addhld.prev.width[0]);
				var right=(place<addhld.prev.width[0])?(place+pwidth):(place>addhld.prev.width[1]?place:addhld.prev.width[1]);
				var x={
					type:"slide",
					width:[left,right],
					from:[],
					time:addsld.prev.time,
					lr:addsld.prev.lr
				};
				x.from=[(x.width[0]<addsld.prev.width[0])?x.width[0]:addsld.prev.width[0],x.width[1]>addsld.prev.width[1]?x.width[1]:addsld.prev.width[1]];
				dummy.graphics.c();
				insert(x,addsld.prev);
				newslide(x,addsld.prev);
				addsld.clicked=false;
				if(addsld.washold){
					addsld.washold=false;
					$(".hldbt").click();
				}
			}else if(addhld.clicked){
				var place=Math.round(evt.stageX*16/cw);
				var dummyY=evt.stageY+sliderY;
				var time=Math.ceil((dummyY==0?1:dummyY)*min/mh);
				if(place>16)place=(16);
				if(place<1)place=1;
				var pwidth=addhld.prev.width[1]-addhld.prev.width[0];
				var left=(place<addhld.prev.width[0])?place:(place>addhld.prev.width[1]?place-pwidth:addhld.prev.width[0]);
				var right=(place<addhld.prev.width[0])?(place+pwidth):(place>addhld.prev.width[1]?place:addhld.prev.width[1]);
				var x={
					type:"hold",
					time:{int:maxme-Math.floor((time-1)/min),num:(min-time%min)%min+1,den:min},
					width:[left,right],
					lr:addhld.prev.lr
				};
				dummy.graphics.c();
				insert(x,addhld.prev);
				newhold(x,addhld.prev);
				addhld.clicked=false;
			}else if(adddwn){
				var dummyY=evt.stageY+sliderY;
				var time=Math.ceil((dummyY==0?1:dummyY)*min/mh);
				var x={
					type:"down",
					time:{int:maxme-Math.floor((time-1)/min),num:(min-time%min)%min+1,den:min}
				};
				dummy.graphics.c();
				insert(x);
				newdown(x);
				adddwn=false;
			}else if(addjmp){
				var dummyY=evt.stageY+sliderY;
				var time=Math.ceil((dummyY==0?1:dummyY)*min/mh);
				var x={
					type:"jump",
					time:{int:maxme-Math.floor((time-1)/min),num:(min-time%min)%min+1,den:min}
				};
				dummy.graphics.c();
				insert(x);
				newjump(x);
				addjmp=false;
			}
		});

		//==============button controll
		
		$(".minbt").click(function(e){
			$(".minbt").removeClass("btn-primary");
			$(".minbt").addClass("btn-light");
			$(this).removeClass("btn-light");
			$(this).addClass("btn-primary");
			min=parseInt($(this).html());
		});

		$(".tonbt").click(function(e){
			if(edit!="d")$(".dsbbt").click();
			if(addtap){
				addtap=false;
				$(this).html("TAP-ON");
				$(this).removeClass("btn-danger");
				$(this).addClass("btn-success");
			}else{
				addtap=true;
				if(addhld.start)$(".hldbt").click();
				$(this).html("TAP-OFF");
				$(this).removeClass("btn-success");
				$(this).addClass("btn-danger");
			}
		});

		$(".tapbt").click(function(e){
			addtype=$(this).html();
		});

		$(".tawbt").click(function(e){
			if(addwid==6){
				addwid=5;
				$(".tawbt").removeClass("btn-primary");
				$(".tawbt").addClass("btn-light");
				$(this).removeClass("btn-light");
				$(this).addClass("btn-primary");
			}else{
				addwid=6;
				$(".tawbt").removeClass("btn-primary");
				$(".tawbt").addClass("btn-light");
				$(this).removeClass("btn-light");
				$(this).addClass("btn-primary");
			}
		});

		$(".hldbt").click(function(e){
			if(edit!="d")$(".dsbbt").click();
			if(addhld.start){
				addhld.start=false;
				addhld.clicked=false;
				$(this).html("HOLD-ON");
				$(this).removeClass("btn-danger");
				$(this).addClass("btn-success");
			}else{
				addhld.start=true;
				addhld.clicked=false;
				if(addtap)$(".tonbt").click();
				$(this).html("HOLD-OFF");
				$(this).removeClass("btn-success");
				$(this).addClass("btn-danger");
			}
		});

		$(".sldbt").click(function(e){
			if(edit!="d")$(".dsbbt").click();
			addsld.start=true;
			addsld.clicked=false;
			if(addhld.start){
				$(".hldbt").click();
				addsld.washold=true;
			}
		});
		$(".dwnbt").click(function(e){
			if(edit!="d")$(".dsbbt").click();
			adddwn=true;
		});
		$(".jmpbt").click(function(e){
			if(edit!="d")$(".dsbbt").click();
			addjmp=true;
		});
		$(".rdrbt").click(function(e){
			score=editor.get();
			maxme=score[score.length-1].time.int;
			ch=mh*maxme;
			rebuild=true;
		});
		$(".nmebt").click(function(e){
			maxme+=1;
			ch=mh*maxme;
			rebuild=true;
		});
		$(".edtbt").click(function(e){
			$(".clrbt").click();
			$(".edtbt").removeClass("btn-primary");
			$(".edtbt").addClass("btn-light");
			$(this).removeClass("btn-light");
			$(this).addClass("btn-primary");
			edit=$(this).attr("data");
		});
		$(".clrbt").click(function(e){
			if(addhld.start)
				$(".hldbt").click();
			if(addtap)
				$(".tonbt").click();
			addsld.start=false;
			adddwn=false;
			addjmp=false;
		});
		$("#submit").click(function(e){
			$.ajax({
				url:"receiver.php",
				method:"POST",
				data:{s:JSON.stringify(editor.get()),g:grecaptcha.getResponse(),n:$("#fn").val(),r:parseInt(Math.random()*150)}
			}).done(function(data){
				console.log(data);
			});
		});
		$("#slider").height($(window).height()-parseInt(window.getComputedStyle(document.getElementsByTagName("body")[0]).getPropertyValue('padding-top'))-parseInt(window.getComputedStyle(document.getElementsByTagName("body")[0]).getPropertyValue('padding-bottom')));

		$( "#slider" ).slider({
			orientation: "vertical",
			range: "min",
			min: 0,
			max: 10000,
			value: 10000,
			change: function( event, ui ) {
				var pos=1-(ui.value/10000);
				sliderY=(maxme*mh-$(window).height())*pos;
				stage.setTransform(0,(-1*sliderY));
				update=true;
			}
		});
		document.getElementsByClassName("editarea")[0].addEventListener("wheel", function(evt){
			$("#slider").slider("value",($("#slider").slider("value")+(evt.deltaY>0?-100:100)));
			//$("#slider").trigger("slide");
		});
		</script>
	</body>
</html>
