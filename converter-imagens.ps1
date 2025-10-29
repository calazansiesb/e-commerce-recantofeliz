# Script para converter todas as imagens para .jpg
# Requer: ImageMagick instalado (convert command)

$imagemDir = ".\imagens\produtos"
$backupDir = ".\imagens\produtos\backup"

# Criar pasta de backup
if (-not (Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir | Out-Null
    Write-Host "✅ Pasta de backup criada: $backupDir"
}

# Conversão de imagens
$convertidas = 0
$falhadas = 0

# Array com extensões para converter
$extensoesParaConverter = @(".png", ".jpeg", ".webp")

Get-ChildItem -Path $imagemDir -File | Where-Object { $extensoesParaConverter -contains $_.Extension } | ForEach-Object {
    $arquivoOriginal = $_.FullName
    $nomeBase = [System.IO.Path]::GetFileNameWithoutExtension($_.Name)
    $nomovoArquivo = Join-Path $imagemDir "$nomeBase.jpg"
    
    # Não converter se já existe .jpg com mesmo nome
    if ((Test-Path $nomovoArquivo) -and $_.Extension -ne ".jpg") {
        Write-Host "⏭️  Pulando $($_.Name) - $nomeBase.jpg já existe"
        Move-Item -Path $arquivoOriginal -Destination "$backupDir\$($_.Name)" -Force
        $convertidas++
        return
    }
    
    try {
        # Usar ImageMagick para converter
        & magick "$arquivoOriginal" "$nomovoArquivo"
        
        if (Test-Path $nomovoArquivo) {
            Write-Host "✅ Convertido: $($_.Name) → $nomeBase.jpg"
            # Mover arquivo original para backup
            Move-Item -Path $arquivoOriginal -Destination "$backupDir\$($_.Name)" -Force
            $convertidas++
        } else {
            Write-Host "❌ Falha ao converter: $($_.Name)"
            $falhadas++
        }
    } catch {
        Write-Host "❌ Erro ao converter $($_.Name): $_"
        $falhadas++
    }
}

Write-Host "`n📊 Resumo:"
Write-Host "✅ Convertidas: $convertidas"
Write-Host "❌ Falhadas: $falhadas"
Write-Host "📁 Backups salvos em: $backupDir"

# Listar imagens finais
Write-Host "`n📋 Imagens finais por extensão:"
Get-ChildItem -Path $imagemDir -File | Where-Object { $_.Name -notlike "backup*" } | Group-Object Extension | ForEach-Object {
    Write-Host "  $($_.Name): $($_.Count) arquivos"
}
