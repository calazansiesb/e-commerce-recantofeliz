#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para converter todas as imagens para .jpg
Requer: Python 3 + Pillow
"""

import os
import shutil
from PIL import Image
from pathlib import Path

def converter_imagens():
    # Diretórios
    imagem_dir = Path("imagens/produtos")
    backup_dir = imagem_dir / "backup"
    
    # Criar pasta de backup
    backup_dir.mkdir(exist_ok=True)
    print(f"✅ Pasta de backup: {backup_dir}")
    
    # Estatísticas
    convertidas = 0
    puladas = 0
    falhadas = 0
    
    # Extensões para converter
    extensoes_converter = {'.png', '.jpeg', '.jpg', '.webp'}
    
    # Processar arquivos
    for arquivo in sorted(imagem_dir.glob('*')):
        if arquivo.is_dir():
            continue
            
        if arquivo.suffix.lower() not in extensoes_converter:
            continue
        
        nome_base = arquivo.stem
        novo_arquivo = imagem_dir / f"{nome_base}.jpg"
        
        # Se já é .jpg, pular
        if arquivo.suffix.lower() == '.jpg':
            print(f"⏭️  Pulando: {arquivo.name} (já é .jpg)")
            puladas += 1
            continue
        
        # Se .jpg já existe com esse nome, fazer backup da origem
        if novo_arquivo.exists():
            print(f"⏭️  Pulando: {arquivo.name} - {novo_arquivo.name} já existe")
            # Mover original para backup
            shutil.move(str(arquivo), str(backup_dir / arquivo.name))
            puladas += 1
            continue
        
        try:
            # Abrir imagem original
            img = Image.open(arquivo)
            
            # Converter RGBA para RGB se necessário (PNG com transparência)
            if img.mode in ('RGBA', 'LA', 'P'):
                # Criar fundo branco
                fundo = Image.new('RGB', img.size, (255, 255, 255))
                if img.mode == 'P':
                    img = img.convert('RGBA')
                fundo.paste(img, mask=img.split()[3] if img.mode == 'RGBA' else None)
                img = fundo
            
            # Salvar como JPEG com qualidade otimizada
            img.convert('RGB').save(novo_arquivo, 'JPEG', quality=90, optimize=True)
            
            print(f"✅ Convertido: {arquivo.name} → {novo_arquivo.name}")
            
            # Mover original para backup
            shutil.move(str(arquivo), str(backup_dir / arquivo.name))
            convertidas += 1
            
        except Exception as e:
            print(f"❌ Erro ao converter {arquivo.name}: {str(e)}")
            falhadas += 1
    
    # Relatório
    print(f"\n📊 Resumo da conversão:")
    print(f"✅ Convertidas:  {convertidas}")
    print(f"⏭️  Puladas:     {puladas}")
    print(f"❌ Falhadas:    {falhadas}")
    print(f"📁 Backups em:   {backup_dir}")
    
    # Listar imagens finais
    print(f"\n📋 Imagens finais por extensão:")
    extensoes_count = {}
    for arquivo in imagem_dir.glob('*'):
        if arquivo.is_file():
            ext = arquivo.suffix.lower()
            extensoes_count[ext] = extensoes_count.get(ext, 0) + 1
    
    for ext in sorted(extensoes_count.keys()):
        print(f"  {ext}: {extensoes_count[ext]} arquivos")
    
    print(f"\n🎉 Conversão concluída!")

if __name__ == "__main__":
    try:
        converter_imagens()
    except Exception as e:
        print(f"❌ Erro fatal: {str(e)}")
