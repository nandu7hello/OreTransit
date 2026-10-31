param([string]$Key, [string]$Out)
Add-Type -AssemblyName System.Drawing
$s = "C:\Users\gbpnk\AppData\Local\Temp\claude\C--Users-gbpnk-Code\51561f0f-88bc-477f-9469-2f6b26a1a49d\scratchpad\orecart"
$d = Get-Content "$s\render-$Key.json" -Raw | ConvertFrom-Json
[int]$W = $d.W; [int]$H = $d.H
$bmp = New-Object System.Drawing.Bitmap $W, $H
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = 'AntiAlias'; $g.TextRenderingHint = 'AntiAliasGridFit'; $g.InterpolationMode = 'HighQualityBicubic'
$C = { param($hex) [System.Drawing.ColorTranslator]::FromHtml($hex) }
# palette (matches the current artwork)
$g.Clear((& $C '#E9E4D8'))
function Pts($arr) { $l = New-Object System.Collections.Generic.List[System.Drawing.PointF]; foreach ($p in $arr) { $l.Add((New-Object System.Drawing.PointF ([single]$p[0]), ([single]$p[1]))) }; return $l.ToArray() }
# terrain hint: soft lighter blobs are skipped; campus + parks
foreach ($poly in $d.campus) { if ($poly.Count -ge 3) { $b = New-Object System.Drawing.SolidBrush (& $C '#E3DED0'); $g.FillPolygon($b, [System.Drawing.PointF[]](Pts $poly)) } }
foreach ($poly in $d.parks) { if ($poly.Count -ge 3) { $b = New-Object System.Drawing.SolidBrush (& $C '#DCE3CF'); $g.FillPolygon($b, [System.Drawing.PointF[]](Pts $poly)) } }
foreach ($wat in $d.water) {
  if ($wat.poly) { if ($wat.poly.Count -ge 3) { $b = New-Object System.Drawing.SolidBrush (& $C '#9FC7DF'); $g.FillPolygon($b, [System.Drawing.PointF[]](Pts $wat.poly)) } }
  elseif ($wat.p.Count -ge 2) { $pen = New-Object System.Drawing.Pen ((& $C '#9FC7DF'), [single]($wat.w * 1.6)); $pen.LineJoin = 'Round'; $pen.StartCap = 'Round'; $pen.EndCap = 'Round'; $g.DrawLines($pen, [System.Drawing.PointF[]](Pts $wat.p)) }
}
# roads: casing then fill, by class
$widths = @{ 0 = 1.4; 1 = 4.0; 2 = 6.0; 3 = 8.5 }
foreach ($cls in 0, 1, 2, 3) {
  $pen = New-Object System.Drawing.Pen ((& $C '#D5D0C3'), [single]($widths[$cls] + 2.2)); $pen.LineJoin = 'Round'; $pen.StartCap = 'Round'; $pen.EndCap = 'Round'
  foreach ($r in $d.roads) { if ($r.c -eq $cls -and $r.p.Count -ge 2) { $g.DrawLines($pen, [System.Drawing.PointF[]](Pts $r.p)) } }
}
foreach ($cls in 0, 1, 2, 3) {
  $pen = New-Object System.Drawing.Pen ([System.Drawing.Color]::White, [single]$widths[$cls]); $pen.LineJoin = 'Round'; $pen.StartCap = 'Round'; $pen.EndCap = 'Round'
  foreach ($r in $d.roads) { if ($r.c -eq $cls -and $r.p.Count -ge 2) { $g.DrawLines($pen, [System.Drawing.PointF[]](Pts $r.p)) } }
}
# street labels
$font = New-Object System.Drawing.Font('DM Sans', 15, [System.Drawing.FontStyle]::Regular)
if ($font.Name -ne 'DM Sans') { $font = New-Object System.Drawing.Font('Segoe UI', 15) }
$lb = New-Object System.Drawing.SolidBrush (& $C '#5A5F6B')
$fmt = New-Object System.Drawing.StringFormat; $fmt.Alignment = 'Center'; $fmt.LineAlignment = 'Center'
$halo = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(200, 255, 255, 255), 4); $halo.LineJoin = 'Round'
foreach ($l in $d.labels) {
  $st = $g.Save(); $g.TranslateTransform([single]$l.x, [single]$l.y); $g.RotateTransform([single]$l.a)
  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $path.AddString($l.t, $font.FontFamily, [int]$font.Style, [single]20, (New-Object System.Drawing.PointF 0, 0), $fmt)
  $g.DrawPath($halo, $path); $g.FillPath($lb, $path)
  $g.Restore($st)
}
# landmark labels (italic, dark, centred)
$lf = New-Object System.Drawing.Font($font.FontFamily, 17, [System.Drawing.FontStyle]::Italic)
$lmb = New-Object System.Drawing.SolidBrush (& $C '#3C4452')
foreach ($lm in $d.landmarks) { $g.DrawString($lm.t.Replace('|', "`n"), $lf, $lmb, (New-Object System.Drawing.PointF ([single]$lm.x), ([single]$lm.y)), $fmt) }
# route lines: de-emphasised routes faint, emphasised route strong with dash style per route
$style = @{ gold = 'Solid'; tungsten = 'Dash'; silver = 'Dot' }
foreach ($k in 'gold', 'silver', 'tungsten') {
  $r = $d.routes.$k; if ($r.p.Count -lt 2) { continue }
  $col = & $C $r.color
  if (-not $r.emph) { $col = [System.Drawing.Color]::FromArgb(70, $col.R, $col.G, $col.B) }
  $pen = New-Object System.Drawing.Pen ($col, [single]($(if ($r.emph) { 7 } else { 5 }))); $pen.LineJoin = 'Round'; $pen.StartCap = 'Round'; $pen.EndCap = 'Round'
  $pen.DashStyle = $style[$k]; if ($style[$k] -ne 'Solid') { $pen.DashCap = 'Round' }
  $g.DrawLines($pen, [System.Drawing.PointF[]](Pts $r.p))
}
# cart icons at stops
$logo = [System.Drawing.Image]::FromFile("C:\Users\gbpnk\Code\oretransit\assets\ore-cart-logo.png")
$iconW = $(if ($Key -eq 'overview') { 30 } else { 40 }); $iconH = [int]($iconW * $logo.Height / $logo.Width)
foreach ($k in 'gold', 'silver', 'tungsten') {
  $r = $d.routes.$k
  foreach ($st in $d.stops.$k) {
    $x = [single]$st.x; $y = [single]$st.y
    $ring = New-Object System.Drawing.Pen ((& $C $r.color), 3)
    $fill = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb($(if ($r.emph) { 255 } else { 150 }), 255, 255, 255))
    $rad = $iconW * 0.62
    $g.FillEllipse($fill, $x - $rad, $y - $rad, 2 * $rad, 2 * $rad)
    $g.DrawEllipse($ring, $x - $rad, $y - $rad, 2 * $rad, 2 * $rad)
    $g.DrawImage($logo, [single]($x - $iconW / 2), [single]($y - $iconH / 2), [single]$iconW, [single]$iconH)
  }
}
# title + key box
$tf = New-Object System.Drawing.Font($font.FontFamily, 30, [System.Drawing.FontStyle]::Bold)
$kf = New-Object System.Drawing.Font($font.FontFamily, 16)
$bx = $W - 330; $by = 24; $bw = 306; $bh = 150
$g.FillRectangle((New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(235, 255, 255, 255))), $bx, $by, $bw, $bh)
$g.DrawRectangle((New-Object System.Drawing.Pen ((& $C '#D5D0C3'), 1)), $bx, $by, $bw, $bh)
$g.DrawString($d.title, $tf, (New-Object System.Drawing.SolidBrush (& $C '#102343')), $bx + 14, $by + 8)
$ky = $by + 56
foreach ($k in 'gold', 'silver', 'tungsten') {
  $r = $d.routes.$k; $col = & $C $r.color
  $pen = New-Object System.Drawing.Pen ($col, 6); $pen.DashStyle = $style[$k]; if ($style[$k] -ne 'Solid') { $pen.DashCap = 'Round' }
  $g.DrawLine($pen, $bx + 16, $ky + 11, $bx + 70, $ky + 11)
  $g.DrawString((@{ gold = 'Gold Route'; silver = 'Silver Route'; tungsten = 'Tungsten Route' })[$k], $kf, (New-Object System.Drawing.SolidBrush (& $C '#102343')), $bx + 84, $ky)
  $ky += 28
}
$g.Dispose()
$bmp.Save($Out, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose(); $logo.Dispose()
"wrote $Out ($W x $H)"
