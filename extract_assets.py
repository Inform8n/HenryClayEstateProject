import os
import io
import pypdf
import pypdfium2 as pdfium
from PIL import Image

OUT_DIR = os.path.join(os.getcwd(), "public", "maps")
os.makedirs(OUT_DIR, exist_ok=True)

pdf_path = "Dissertation Proposal Defense.pdf"
print(f"Extracting assets from {pdf_path} into {OUT_DIR}...")

# 1. Render all slides at high resolution (scale=3.0 -> 2160x1215)
pdf_doc = pdfium.PdfDocument(pdf_path)
slide_names = {
    1: "slide_1_title.png",
    2: "1865_ashland_farm_slide.png",
    3: "1980_subdivision_overlay.png",
    4: "1800_1900_clay_purchases.png",
    5: "master_archaeology_recon.png",
    6: "cemetery_headstones_slide.png",
    7: "2024_orthophoto_annotated.png",
    8: "usgs_aerial_survey_slide.png",
    9: "1965_usgs_aerial.png",
    10: "1949_usgs_aerial.png"
}

for idx, page in enumerate(pdf_doc):
    page_num = idx + 1
    filename = slide_names.get(page_num, f"slide_{page_num}.png")
    out_file = os.path.join(OUT_DIR, filename)
    img = page.render(scale=3.0).to_pil()
    img.save(out_file, optimize=True)
    print(f"Rendered slide {page_num} -> {filename} ({img.size})")

# 2. Extract raw embedded images
reader = pypdf.PdfReader(pdf_path)
for page_idx, page in enumerate(reader.pages):
    page_num = page_idx + 1
    for img_idx, img_obj in enumerate(page.images):
        raw_name = f"page_{page_num}_raw_{img_idx}_{img_obj.name}"
        raw_path = os.path.join(OUT_DIR, raw_name)
        with open(raw_path, "wb") as f:
            f.write(img_obj.data)
        
        # Also create clean aliases for primary maps
        try:
            pil_img = Image.open(io.BytesIO(img_obj.data))
            if page_num == 2 and img_idx == 0:
                pil_img.save(os.path.join(OUT_DIR, "1865_ashland_farm_raw.png"))
            elif page_num == 4 and img_idx == 0:
                pil_img.save(os.path.join(OUT_DIR, "1800_1900_clay_purchases_raw.png"))
            elif page_num == 5 and img_idx == 0:
                pil_img.save(os.path.join(OUT_DIR, "master_archaeology_recon_raw.png"))
            elif page_num == 6:
                pil_img.save(os.path.join(OUT_DIR, f"cemetery_field_evidence_{img_idx}.png"))
            elif page_num == 7 and img_idx == 0:
                pil_img.save(os.path.join(OUT_DIR, "2024_orthophoto_raw.png"))
            elif page_num == 8 and img_idx == 0:
                pil_img.convert("RGB").save(os.path.join(OUT_DIR, "usgs_aerial_scan_raw.png"))
            elif page_num == 9 and img_idx == 0:
                pil_img.save(os.path.join(OUT_DIR, "1965_usgs_aerial_raw.png"))
            elif page_num == 10 and img_idx == 0:
                pil_img.save(os.path.join(OUT_DIR, "1949_usgs_aerial_raw.png"))
            print(f"Saved raw image page {page_num} #{img_idx}: {pil_img.size}")
        except Exception as e:
            print(f"Could not convert raw image {raw_name}: {e}")

print("All archival assets successfully extracted!")
