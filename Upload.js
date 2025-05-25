var oUploadedFiles = [];

function OnLoad() {

	if (_("tbServer"))_("btnDelete").style.display = "";
	
	_("file1").addEventListener("change", FileSelectHandler, false);

	var xhr = new XMLHttpRequest();
	if (xhr.upload) {
		
		var filedrag = _("divDropHere");
		if (filedrag){
			filedrag.addEventListener("dragover", FileDragHover, false);
			filedrag.addEventListener("dragleave", FileDragHover, false);
			filedrag.addEventListener("drop", FileSelectHandler, false);
			filedrag.style.display = "block";
		}

		_("btnUpload").style.display = "none";
	}
}

function FileDragHover(e) {
	e.stopPropagation();
	e.preventDefault();
	e.target.className = (e.type=="dragover")?"hover":"";
}

function FileSelectHandler(e) {
	FileDragHover(e);

	var oFiles = e.target.files || e.dataTransfer.files;
	if (oFiles.length==0) return;

	var sFolder = form1.hdnFolder.value;
	if (sFolder=="") sFolder = "upload";
	
	var sHtml = "<table id='tbClient' class='StatusTable' border=1 cellspacing=0 cellpadding=3><tr><th>File name</th><th>Size</th><th>Date Modified</th>"
		+ "<th><input type=checkbox name=chkDeleteAll onclick='DeleteAll(this)'>Delete</th></tr>";
	for (var i=0; i<oFiles.length; i++){
		sHtml += GetRowHtml(sFolder, oFiles[i].name, oFiles[i].size, i+"");
	}
	
	for (var i=0; i<oUploadedFiles.length; i++){
		sHtml += GetRowHtml(sFolder, oUploadedFiles[i].name, oUploadedFiles[i].size, "");
	}
	
	var sServerHtml = "";
	if (_("tbServer")){
		_("trHeader").style.display = "none";
		_("tbServer").style.display = "none";
		sServerHtml = _("tbServer").innerHTML;
	}
	
	_("divStatus").innerHTML = sHtml + sServerHtml + "</table>";
	
	for (var i=0; i<oFiles.length; i++){
		UploadFile(oFiles[i],i);
	}
}

function GetRowHtml(sFolder, sName, iSize, i){
	var s = "<tr><td><a href='" + sFolder + "/" + sName + "' target='_blank'>" + sName + "</a></td>"
			+ "<td>" + (iSize/1024).formatNumber(0,',','.') + " KB</td>"
		
		if (i==""){
			s += "<td><div class='progressBar progressSuccess'>&nbsp;</div></td>";
		}else{
			s += "<td id=progressBar"+i+"></td>";
		}

	return s + "<td><input type=checkbox name=chkDelete value=\"" + sName + "\"></td></tr>";
}

function UploadFile(file,i) {
	var xhr = new XMLHttpRequest();
	if (xhr.upload) {
		var progress = _("progressBar"+i).appendChild(document.createElement("div"));
		progress.className = "progressBar";
		progress.innerHTML = "&nbsp;";

		// progress bar
		xhr.upload.addEventListener("progress", function(e) {
			var pc = parseInt(100 - (e.loaded / e.total * 100));
			progress.style.backgroundPosition = pc + "% 0";
		}, false);

		// file received/failed
		xhr.onreadystatechange = function(e) {
			if (xhr.readyState == 4) {
				progress.className = "progressBar " + (xhr.status == 200 ? "progressSuccess" : "progressFailed");
				if (xhr.status == 200){
					oUploadedFiles[oUploadedFiles.length] = {name: file.name, size: file.size};
					_("btnDelete").style.display = ""
				}
			}
		};

		var oFormData = new FormData();
		oFormData.append("myfile"+i, file);
		xhr.open("POST", _("form1").action, true);
		xhr.send(oFormData);
	}
}

function DeleteAll(o){
	var oBoxes = document.getElementsByTagName("input");
	for (var i=1; i<oBoxes.length; i++){
		oBoxes[i].checked = o.checked;
	}
}

function _(id) {
	return document.getElementById(id);
}

Number.prototype.formatNumber = function(decPlaces, thouSeparator, decSeparator) {
    var n = this,
        decPlaces = isNaN(decPlaces = Math.abs(decPlaces)) ? 2 : decPlaces,
        decSeparator = decSeparator == undefined ? "." : decSeparator,
        thouSeparator = thouSeparator == undefined ? "," : thouSeparator,
        sign = n < 0 ? "-" : "",
        i = parseInt(n = Math.abs(+n || 0).toFixed(decPlaces)) + "",
        j = (j = i.length) > 3 ? j % 3 : 0;
    return sign + (j ? i.substr(0, j) + thouSeparator : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thouSeparator) + (decPlaces ? decSeparator + Math.abs(n - i).toFixed(decPlaces).slice(2) : "");
};
