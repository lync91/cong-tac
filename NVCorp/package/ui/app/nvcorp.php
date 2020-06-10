
<?php
		require('JWT.php');

		$token = array();
		

		if (isset($_SERVER['HTTP_X_FORWARDED_FOR'])){
			$clientIP = $_SERVER['HTTP_X_FORWARDED_FOR'];
	   } elseif (isset($_SERVER['HTTP_X_REAL_IP'])){
			$clientIP = $_SERVER['HTTP_X_REAL_IP'];
	   } else {
			$clientIP = $_SERVER['REMOTE_ADDR'];
	   }
	   putenv('HTTP_COOKIE='.$_SERVER['HTTP_COOKIE']);
	   putenv('REMOTE_ADDR='.$clientIP);
	   $login = shell_exec("/usr/syno/synoman/webman/login.cgi");
	   preg_match('/\"SynoToken\"\s*?:\s*?\"(.*)\"/',$login,$synotoken);
	   $synotoken = trim($synotoken[1]);
	   putenv('QUERY_STRING=SynoToken='.$synotoken);
	   $synouser = shell_exec("/usr/syno/synoman/webman/modules/authenticate.cgi");
	//    echo $synotoken;
	//    echo $synouser;
		$token['user'] = str_replace(array("\n", "\r"), '', $synouser);
        $token['synotoken'] = $synotoken;
        // echo $synotoken;
        $entoken = JWT::encode($token, '6915e143042a5916d39d34dbe7c76223');
        // echo 'var token = '.$entoken;
        // header("Location: https://a.nvcorp.net/signtoken?access_token=" . $entoken, true, 301);
        // $url = "http://localhost:8043/token/" . $synouser;
        // echo $url;
        // $post_fields = 'postvars=val1&postvars2=val2';
        // $ch = curl_init();
        ?>

<!DOCTYPE html>
<html lang="en" data-ng-app="app">
<head>
  <meta charset="utf-8" />
  <title>Angular version | Angulr</title>
  <meta name="description" content="app, web app, responsive, responsive layout, admin, admin panel, admin dashboard, flat, flat ui, ui kit, AngularJS, ui route, charts, widgets, components" />
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
  <link rel="stylesheet" href="css/app.min.css" type="text/css" />
</head>
<body ng-controller="AppCtrl">
<div class="app no-header" id="app" ng-class="{'app-header-fixed':app.settings.headerFixed, 'app-aside-fixed':app.settings.asideFixed, 'app-aside-folded':app.settings.asideFolded, 'app-aside-dock':app.settings.asideDock, 'container':app.settings.container}" ui-view></div>
  <!-- jQuery -->
  <script><?php echo 'var token = "'.$entoken.'"' ?></script>
  <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCJs58PAeRIAfO64XBbG9S2G_KCqDdn6E0&libraries=places&sensor=false"></script>
  <script src="js/app.min.js"></script>
  <!-- Lazy loading -->
</body>
</html>