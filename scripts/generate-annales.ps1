$dataPath = "c:\Users\DL\ReviseTonBrevet\data\annales.json"
$templatePath = "c:\Users\DL\ReviseTonBrevet\templates\annale-template.html"
$outputDir = "c:\Users\DL\ReviseTonBrevet\annales"

if (!(Test-Path $outputDir)) { New-Item -ItemType Directory -Path $outputDir }

$annales = Get-Content $dataPath | ConvertFrom-Json
$template = Get-Content $templatePath -Raw

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
    [System.IO.File]::WriteAllText($outputPath, $content, (New-Object System.Text.UTF8Encoding($false)))
    Write-Host "Généré : $($a.id).html"
}
