#!/usr/bin/env python3
import os
from PIL import Image
import shutil

def otimizar_imagem(caminho_origem, qualidade=85, max_width=1920):
    """Otimiza uma imagem reduzindo tamanho e qualidade"""
    try:
        # Backup da original
        backup_path = caminho_origem.replace('imagens/', 'backup-otimizacao-2025/imagens-originais/')
        os.makedirs(os.path.dirname(backup_path), exist_ok=True)
        shutil.copy2(caminho_origem, backup_path)
        
        # Abrir e otimizar
        with Image.open(caminho_origem) as img:
            # Converter RGBA para RGB se necessário
            if img.mode in ('RGBA', 'LA'):
                background = Image.new('RGB', img.size, (255, 255, 255))
                background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
                img = background
            
            # Redimensionar se muito grande
            if img.width > max_width:
                ratio = max_width / img.width
                new_height = int(img.height * ratio)
                img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)
            
            # Salvar otimizada
            if caminho_origem.lower().endswith('.png'):
                img.save(caminho_origem, 'JPEG', quality=qualidade, optimize=True)
                # Renomear para .jpg
                novo_caminho = caminho_origem.replace('.png', '.jpg')
                os.rename(caminho_origem, novo_caminho)
                return novo_caminho
            else:
                img.save(caminho_origem, quality=qualidade, optimize=True)
                return caminho_origem
                
    except Exception as e:
        print(f"Erro ao otimizar {caminho_origem}: {e}")
        return None

def main():
    # Imagens prioritárias para otimização
    imagens_grandes = [
        'imagens/carrocel/0.1.png',
        'imagens/carrocel/ovo sesta.png', 
        'imagens/carrocel/adubo-organico.png',
        'imagens/carrocel/agricultura-familiar.png',
        'imagens/carrocel/gerar uma imagem que.png',
        'imagens/produtos/1.1.png',
        'imagens/produtos/7.1.png',
        'imagens/produtos/5.1.png',
        'imagens/produtos/10.2.png',
        'imagens/produtos/2.1.png',
        'imagens/agradecimento pedido.png'
    ]
    
    print("Iniciando otimizacao de imagens...")
    
    for imagem in imagens_grandes:
        if os.path.exists(imagem):
            tamanho_antes = os.path.getsize(imagem) / (1024*1024)  # MB
            print(f"Otimizando {imagem} ({tamanho_antes:.1f}MB)...")
            
            novo_caminho = otimizar_imagem(imagem)
            if novo_caminho:
                tamanho_depois = os.path.getsize(novo_caminho) / (1024*1024)  # MB
                economia = ((tamanho_antes - tamanho_depois) / tamanho_antes) * 100
                print(f"OK {novo_caminho} ({tamanho_depois:.1f}MB) - Economia: {economia:.1f}%")
            else:
                print(f"ERRO Falha ao otimizar {imagem}")
        else:
            print(f"AVISO Arquivo nao encontrado: {imagem}")
    
    print("\nOtimizacao concluida!")

if __name__ == "__main__":
    main()