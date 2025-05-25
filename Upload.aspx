<%@ Page Language="vb" CodeFile="Upload.aspx.vb" Inherits="Upload" %>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>File upload</title>
<link href="Upload.css" rel="stylesheet" type="text/css" media="all" />
<script src="Upload.js"></script>
</head>
<body onload="OnLoad()">

<form id="form1" action="Upload.aspx?folder=<%=Request.QueryString("folder")%>" method="POST" enctype="multipart/form-data">

<fieldset>
<legend style="font-weight: bold; color: #333;">HTML File Upload <%=IIf(Request.QueryString("folder") = "", "", " for '" & Request.QueryString("folder") & "'")%></legend>

<div>
	<label for="file1">Files to upload:</label>
	<input type="file" id="file1" name="file1" multiple="multiple" />
	<input type=button value="Refresh" onclick="location=location.href" />
	<input type="submit" value="Delete" name="btnDelete" id="btnDelete" style="display: none;">
	
	<%	If Request.Browser.IsBrowser("InternetExplorer") = False OrElse cint(Request.Browser.Version) > 10 Then%>
	<div id="divDropHere">or drop files here</div>
	<%	End If%>
</div>

<div id="btnUpload">
	<button type="submit">Upload Files</button>
</div>

</fieldset>

<div id="divStatus"></div>

<%ShowFiles()%>

<input type=hidden name="hdnFolder" value="<%=Request.QueryString("folder")%>" />
</form>
</body>
</html>