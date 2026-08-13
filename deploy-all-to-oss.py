#!/usr/bin/env python3
import os
import mimetypes
from pathlib import Path
import subprocess
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
    print("1. 正在编译打包 React 生产代码 (npm run build)...")
    print("==================================================")
    subprocess.run(["npm", "run", "build"], cwd=str(ROOT_DIR), check=True)

    print("\n==================================================")
    print("2. 开始全量同步 React 统一中台与测评静态资源至 OSS...")
    print("==================================================")

    # 1. 部署 public/ 里的 SDK、自定义与内置测评静态资源 (含 admin.html, portal.html)
    public_dir = ROOT_DIR / "public"
    if public_dir.exists():
        print("\n[A] 部署 public 资源 (admin.html, SDK, 自定义与内置测评静态模版)...")
        for f in public_dir.rglob("*"):
            if f.is_file() and not f.name.startswith("."):
                rel_path = f.relative_to(public_dir)
                upload_file(f, str(rel_path))
                if rel_path.name == "admin.html":
                    upload_file(f, "admin")
                if rel_path.name == "portal.html":
                    upload_file(f, "portal")

    # 2. 部署 dist 里的 React 统一后台与主入口
    dist_dir = ROOT_DIR / "dist"
    if dist_dir.exists():
        print("\n[B] 部署 React 生产静态资产 (dist)...")
        for f in dist_dir.rglob("*"):
            if f.is_file() and not f.name.startswith("."):
                rel_path = f.relative_to(dist_dir)
                upload_file(f, str(rel_path))

    print("\n==================================================")
    print("🎉 全量 React 平台与静态测评部署阿里云 OSS 成功！")
    print("==================================================")

if __name__ == "__main__":
    deploy_all()
