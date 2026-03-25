$dataPath = "c:\Users\DL\ReviseTonBrevet\data\fiches.json"
$templatePath = "c:\Users\DL\ReviseTonBrevet\templates\fiche-template.html"
$outputDir = "c:\Users\DL\ReviseTonBrevet\fiches"

if (!(Test-Path $outputDir)) { New-Item -ItemType Directory -Path $outputDir }

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$fiches = [System.IO.File]::ReadAllText($dataPath, $utf8NoBom) | ConvertFrom-Json
$template = [System.IO.File]::ReadAllText($templatePath, $utf8NoBom)

foreach ($f in $fiches) {
    $content = $template
    $content = $content.Replace("{{MATIERE}}", $f.matiere)
    $content = $content.Replace("{{CONCEPT}}", $f.concept)
    $content = $content.Replace("{{DEFINITION}}", $f.definition)
    $content = $content.Replace("{{FORMULE}}", $f.formule)
    $content = $content.Replace("{{ERREUR}}", $f.erreur)
    $content = $content.Replace("{{QUIZ_Q}}", $f.quiz_q)
    $content = $content.Replace("{{QUIZ_A}}", $f.quiz_a)
    $content = $content.Replace("{{ID}}", $f.id)
    
    $outputPath = Join-Path $outputDir "$($f.id).html"
    [System.IO.File]::WriteAllText($outputPath, $content, $utf8NoBom)
    Write-Host "Généré : $($f.id).html"
}
