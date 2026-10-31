Add-Type -AssemblyName System.Drawing

$size = 512
$bmp = New-Object System.Drawing.Bitmap $size, $size, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.Clear([System.Drawing.Color]::Transparent)

# Background rounded rect
$rect = New-Object System.Drawing.Rectangle 16, 16, 480, 480
$radius = 110

$path = New-Object System.Drawing.Drawing2D.GraphicsPath
$path.AddArc($rect.X, $rect.Y, $radius, $radius, 180, 90)
$path.AddArc($rect.Right - $radius, $rect.Y, $radius, $radius, 270, 90)
$path.AddArc($rect.Right - $radius, $rect.Bottom - $radius, $radius, $radius, 0, 90)
$path.AddArc($rect.X, $rect.Bottom - $radius, $radius, $radius, 90, 90)
$path.CloseFigure()

# Background Gradient: Deep Rose (#831843) to Radiant Rose (#E11D48 / #F43F5E)
$c1 = [System.Drawing.Color]::FromArgb(255, 131, 24, 67)
$c2 = [System.Drawing.Color]::FromArgb(255, 236, 72, 153)
$brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush ($rect, $c1, $c2, 45.0)
$g.FillPath($brush, $path)

# Gold luxury border
$goldPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(220, 251, 191, 36), 8)
$g.DrawPath($goldPen, $path)

# Draw inner soft glow
$innerRect = New-Object System.Drawing.Rectangle 26, 26, 460, 460
$innerRadius = 96
$innerPath = New-Object System.Drawing.Drawing2D.GraphicsPath
$innerPath.AddArc($innerRect.X, $innerRect.Y, $innerRadius, $innerRadius, 180, 90)
$innerPath.AddArc($innerRect.Right - $innerRadius, $innerRect.Y, $innerRadius, $innerRadius, 270, 90)
$innerPath.AddArc($innerRect.Right - $innerRadius, $innerRect.Bottom - $innerRadius, $innerRadius, $innerRadius, 0, 90)
$innerPath.AddArc($innerRect.X, $innerRect.Bottom - $innerRadius, $innerRadius, $innerRadius, 90, 90)
$innerPath.CloseFigure()
$glowPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(60, 255, 255, 255), 4)
$g.DrawPath($glowPen, $innerPath)

# Stylized Lotus / Rose Petals in center
$petalBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(250, 255, 255, 255))
$goldBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 252, 211, 77))

# Middle petal
$pPath = New-Object System.Drawing.Drawing2D.GraphicsPath
$pPath.AddBezier(256, 120, 310, 190, 310, 270, 256, 320)
$pPath.AddBezier(256, 320, 202, 270, 202, 190, 256, 120)
$g.FillPath($petalBrush, $pPath)

# Left petal
$leftPath = New-Object System.Drawing.Drawing2D.GraphicsPath
$leftPath.AddBezier(240, 170, 160, 190, 150, 275, 245, 315)
$leftPath.AddBezier(245, 315, 195, 275, 200, 215, 240, 170)
$g.FillPath($petalBrush, $leftPath)

# Right petal
$rightPath = New-Object System.Drawing.Drawing2D.GraphicsPath
$rightPath.AddBezier(272, 170, 352, 190, 362, 275, 267, 315)
$rightPath.AddBezier(267, 315, 317, 275, 312, 215, 272, 170)
$g.FillPath($petalBrush, $rightPath)

# Golden center teardrop (nail polish drop / sparkling gem)
$gemPath = New-Object System.Drawing.Drawing2D.GraphicsPath
$gemPath.AddBezier(256, 185, 280, 230, 280, 265, 256, 290)
$gemPath.AddBezier(256, 290, 232, 265, 232, 230, 256, 185)
$g.FillPath($goldBrush, $gemPath)

# Small sparkles
$sparkleBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 254, 240, 138))
# Sparkle 1 (top right)
$g.FillEllipse($sparkleBrush, 365, 135, 14, 14)
$g.FillEllipse($sparkleBrush, 368, 128, 8, 28)
$g.FillEllipse($sparkleBrush, 358, 138, 28, 8)

# Sparkle 2 (bottom left)
$g.FillEllipse($sparkleBrush, 135, 320, 10, 10)
$g.FillEllipse($sparkleBrush, 137, 315, 6, 20)
$g.FillEllipse($sparkleBrush, 130, 322, 20, 6)

# Text: "ROSE NAIL SPA"
$fontFamily = New-Object System.Drawing.FontFamily "Arial"
$font = New-Object System.Drawing.Font ($fontFamily, 34, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$format = New-Object System.Drawing.StringFormat
$format.Alignment = [System.Drawing.StringAlignment]::Center
$textBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 255, 255, 255))
$goldTextBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 253, 230, 138))

$g.DrawString("ROSE NAIL SPA", $font, $textBrush, 256, 355, $format)

$subFont = New-Object System.Drawing.Font ($fontFamily, 22, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$g.DrawString("POS SYSTEM", $subFont, $goldTextBrush, 256, 405, $format)

$outDir = "C:\Users\thaibao\.gemini\antigravity\scratch\nails-store-pos\build"
if (!(Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir -Force }
$outPng = Join-Path $outDir "icon.png"
$bmp.Save($outPng, [System.Drawing.Imaging.ImageFormat]::Png)

# Generate multi-res ICO from PNG bitmaps
$sizes = @(256, 128, 64, 48, 32, 16)
$pngBytesList = @()

foreach ($s in $sizes) {
    $resized = New-Object System.Drawing.Bitmap $s, $s, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $rg = [System.Drawing.Graphics]::FromImage($resized)
    $rg.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $rg.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $rg.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $rg.DrawImage($bmp, 0, 0, $s, $s)
    $rg.Dispose()
    
    $ms = New-Object System.IO.MemoryStream
    $resized.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png)
    $pngBytesList += ,@($s, $ms.ToArray())
    $ms.Dispose()
    $resized.Dispose()
}

# Assemble standard modern Windows ICO with PNG streams
$icoPath = Join-Path $outDir "icon.ico"
$fs = [System.IO.File]::Create($icoPath)
$bw = New-Object System.IO.BinaryWriter $fs

# ICONDIR header
$bw.Write([UInt16]0) # Reserved
$bw.Write([UInt16]1) # Type 1 = ICO
$bw.Write([UInt16]$sizes.Count) # Image count

$offset = 6 + ($sizes.Count * 16)
foreach ($item in $pngBytesList) {
    $s = $item[0]
    $data = $item[1]
    $bw.Write([byte]$(if ($s -ge 256) { 0 } else { $s })) # Width
    $bw.Write([byte]$(if ($s -ge 256) { 0 } else { $s })) # Height
    $bw.Write([byte]0) # Colors in palette
    $bw.Write([byte]0) # Reserved
    $bw.Write([UInt16]1) # Color planes
    $bw.Write([UInt16]32) # Bits per pixel
    $bw.Write([UInt32]$data.Length) # Size of image data
    $bw.Write([UInt32]$offset) # Offset
    $offset += $data.Length
}

foreach ($item in $pngBytesList) {
    $data = $item[1]
    $bw.Write($data)
}

$bw.Close()
$fs.Close()

$g.Dispose()
$bmp.Dispose()
Write-Host "Generated icon.png and icon.ico successfully!"
