Public Class Upload
    Inherits System.Web.UI.Page

	Dim sFolder As String = "upload"

    Protected Sub Page_Load(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Load

		If Request.QueryString("folder") <> "" Then
			sFolder = Request.QueryString("folder")
		End If

		Dim sFolderPath As String = Server.MapPath(sFolder)
		If System.IO.Directory.Exists(sFolderPath) = False Then
			Response.Write("Folder does not exist: " & sFolderPath)
			Response.End()
		End If

		If Request.HttpMethod = "POST" Then

			If Request.Form("btnDelete") <> "" Then
				'Delete files
				If (Not Request.Form.GetValues("chkDelete") Is Nothing) Then
					For i As Integer = 0 To Request.Form.GetValues("chkDelete").Length - 1
						Dim sFileName As String = Request.Form.GetValues("chkDelete")(i)

						Try
							System.IO.File.Delete(sFolderPath & "\" & sFileName)
						Catch ex As Exception
							'Ignore error
						End Try
					Next
				End If

			Else
				'Upload Files
				For i As Integer = 0 To Request.Files.Count - 1
					Dim oFile As System.Web.HttpPostedFile = Request.Files(i)
					Dim sFileName As String = System.IO.Path.GetFileName(oFile.FileName)

					oFile.SaveAs(sFolderPath & "\" & sFileName)
				Next
			End If

		End If

    End Sub


	Public Sub ShowFiles()
		Dim sFolderPath As String = Server.MapPath(sFolder)
		Dim oFiles As String() = System.IO.Directory.GetFiles(sFolderPath)

		If oFiles.Length = 0 Then
			Exit Sub
		End If

		Response.Write("<table id='tbServer' class='StatusTable' border=1 cellspacing=0 cellpadding=3>")
		Response.Write("<tr id=trHeader><th>File name</th><th>Size</th><th>Date Modified</th>")
		Response.Write("<th><input type=checkbox name=chkDeleteAll onclick='DeleteAll(this)'>Delete</th></tr>")

		For i As Integer = 0 To oFiles.Length - 1
			Dim sFilePath As String = oFiles(i)
			Dim oFileInfo As New System.IO.FileInfo(sFilePath)
			Dim sFileName As String = oFileInfo.Name
			Dim sSize As String = FormatNumber((oFileInfo.Length / 1024), 0)
			If sSize = "0" AndAlso oFileInfo.Length > 0 Then sSize = "1"

			Response.Write("<tr>")
			Response.Write("<td><a href=""" & sFolder & "/" & sFileName & """ target='_blank'>" & sFileName + "</a></td>")
			Response.Write("<td>" & sSize & " KB</td>")
			Response.Write("<td>" & oFileInfo.LastWriteTime.ToShortDateString() & " " & oFileInfo.LastWriteTime.ToShortTimeString() & "</td>")
			Response.Write("<td><input type=checkbox name=chkDelete value=""" & sFileName & """>")
			Response.Write("</tr>")
		Next

		Response.Write("</table>")
	End Sub

End Class