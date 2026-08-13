#!/usr/bin/env python3
import os
import mimetypes
from pathlib import Path
import oss2

ROOT_DIR = Path(__file__).parent.resolve()
env_file = ROOT_DIR / ".env"
if env_file.exists():
    with open(env_file, "r") as f:
        for line in f:
            if "=" in line and not line.startswith("#"):
                k, v = line.strip().split("=", 1)
                os.environ.setdefault(k, v)

OSS_REGION = os.environ.get("OSS_REGION", "oss-cn-shanghai")
OSS_BUCKET = os.environ.get("OSS_BUCKET", "ceping-air")
OSS_ACCESS_KEY_ID = os.environ.get("OSS_ACCESS_KEY_ID", "")
OSS_ACCESS_KEY_SECRET = os.environ.get("OSS_ACCESS_KEY_SECRET", "")

auth = oss2.Auth(OSS_ACCESS_KEY_ID, OSS_ACCESS_KEY_SECRET)
endpoint = f"https://{OSS_REGION}.aliyuncs.com"
bucket = oss2.Bucket(auth, endpoint, OSS_BUCKET)

ROOT_DIR = Path(__file__).parent.resolve()

def upload_file(local_path, object_key):
    mime_type, _ = mimetypes.guess_type(str(local_path))
    headers = {}
    if mime_type:
        headers['Content-Type'] = mime_type
    if local_path.suffix in ['.html', '.js', '.css', '.json']:
        headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    
    bucket.put_object_from_file(object_key, str(local_path), headers=headers)
    print(f"  [OK] {object_key} -> https://ceping.1605ai.com/{object_key}")

def deploy_all():
    print("==================================================")
    print("开始全量同步前端测评与统一后台至阿里云 OSS...")
    print("==================================================")

    # 1. 构建并部署 React 统一主应用 (dist)
    dist_dir = ROOT_DIR / "dist"
    if dist_dir.exists():
        print("\n1. 部署 React 统一主应用 (dist)...")
        for f in dist_dir.rglob("*"):
            if f.is_file() and not f.name.startswith("."):
                rel_path = f.relative_to(dist_dir)
                upload_file(f, str(rel_path))
                if str(rel_path) == "index.html":
                    upload_file(f, "admin.html")
                    upload_file(f, "admin")

    # 1.1 部署 独立统一后台与测评分发中心 (feifan-admin-portal/public)
    admin_portal_public = ROOT_DIR / "feifan-admin-portal" / "public"
    if admin_portal_public.exists():
        print("\n1.1 部署 独立统一后台与测评分发中心 (feifan-admin-portal)...")
        for f in admin_portal_public.rglob("*"):
            if f.is_file() and not f.name.startswith("."):
                rel_path = f.relative_to(admin_portal_public)
                upload_file(f, str(rel_path))

    # 2. 部署 学习风格测评 (learning-style-assessment/public)
    ls_public = ROOT_DIR / "learning-style-assessment" / "public"
    if ls_public.exists():
        print("\n2. 部署 学习风格测评 (learning-style-assessment)...")
        for f in ls_public.rglob("*"):
            if f.is_file() and not f.name.startswith("."):
                rel_path = f.relative_to(ls_public)
                upload_file(f, str(rel_path))

    # 2. 部署 学习动机测评 (motivation-assessment/xxdj-deploy)
    mot_public = ROOT_DIR / "motivation-assessment" / "xxdj-deploy"
    if mot_public.exists():
        print("\n2. 部署 学习动机测评 (xxdj & motivation)...")
        for f in mot_public.rglob("*"):
            if f.is_file() and not f.name.startswith(".") and "node_modules" not in f.parts:
                rel_path = f.relative_to(mot_public)
                upload_file(f, f"xxdj/{rel_path}")
                upload_file(f, f"motivation/{rel_path}")

    # 3. 部署 FTH 创业者测评 (fth-boss-assessment/frontend)
    fth_boss_public = ROOT_DIR / "fth-boss-assessment" / "frontend"
    if fth_boss_public.exists():
        print("\n3. 部署 FTH 创业者测评 (fthboss)...")
        for f in fth_boss_public.rglob("*"):
            if f.is_file() and not f.name.startswith("."):
                rel_path = f.relative_to(fth_boss_public)
                obj_name = "index.html" if rel_path.name == "founder-talent-assessment.html" else str(rel_path)
                upload_file(f, f"fthboss/{obj_name}")

    # 4. 部署 FTH 微信版特质测评 (fth-talent-assessment)
    fth_talent_public = ROOT_DIR / "fth-talent-assessment" / "source" / "fighter-runner-climber-thinker-analyzer-builder" / "outputs"
    if fth_talent_public.exists():
        print("\n4. 部署 FTH 微信版特质测评 (fthtalent)...")
        for f in fth_talent_public.rglob("*"):
            if f.is_file() and not f.name.startswith("."):
                rel_path = f.relative_to(fth_talent_public)
                obj_name = "index.html" if rel_path.name == "wechat-talent-assessment.html" else str(rel_path)
                upload_file(f, f"fthtalent/{obj_name}")

    # 5. 部署 FTH 1605版 (fth-1605-assessment)
    fth_1605_public = ROOT_DIR / "fth-1605-assessment"
    if fth_1605_public.exists():
        print("\n5. 部署 FTH 1605版 (fth1605)...")
        for f in fth_1605_public.rglob("*"):
            if f.is_file() and not f.name.startswith(".") and "node_modules" not in f.parts and ".git" not in f.parts:
                rel_path = f.relative_to(fth_1605_public)
                upload_file(f, f"fth1605/{rel_path}")

    print("\n==================================================")
    print("全量无后端 API 依赖纯前端静态化测评部署成功！")
    print("==================================================")

if __name__ == "__main__":
    deploy_all()
