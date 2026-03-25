$dataPath = "c:\Users\DL\ReviseTonBrevet\data\annales.json"
$templatePath = "c:\Users\DL\ReviseTonBrevet\templates\annale-template.html"
$outputDir = "c:\Users\DL\ReviseTonBrevet\annales"

if (!(Test-Path $outputDir)) { New-Item -ItemType Directory -Path $outputDir }

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$annales = [System.IO.File]::ReadAllText($dataPath, $utf8NoBom) | ConvertFrom-Json
$template = [System.IO.File]::ReadAllText($templatePath, $utf8NoBom)

foreach ($a in $annales) {
    $content = $template
    $content = $content.Replace("{{MATIERE}}", $a.matiere)
    $content = $content.Replace("{{LIEU}}", $a.lieu)
    $content = $content.Replace("{{ANNEE}}", $a.annee)
    $content = $content.Replace("{{ID}}", $a.id)
    $content = $content.Replace("{{URL_TELECHARGEMENT}}", $a.telechargement)
    
    $notionsHtml = ""
    foreach ($n in $a.notions) {
        $notionsHtml += "<li>$n</li>"
    }
    $content = $content.Replace("{{NOTIONS_LIST}}", $notionsHtml)
    
    $outputPath = Join-Path $outputDir "$($a.id).html"
    [System.IO.File]::WriteAllText($outputPath, $content, $utf8NoBom)
    Write-Host "Généré : $($a.id).html"
}
