#!/usr/bin/env python3
import os
from pathlib import Path

OSS_REGION = os.environ.get("OSS_REGION", "oss-cn-shanghai")
OSS_BUCKET = os.environ.get("OSS_BUCKET", "ceping-air")
OSS_PATH_PREFIX = os.environ.get("OSS_PATH_PREFIX", "fth1605")
OSS_ACCESS_KEY_ID = os.environ.get("OSS_ACCESS_KEY_ID", "")
OSS_ACCESS_KEY_SECRET = os.environ.get("OSS_ACCESS_KEY_SECRET", "")

def sync_fth1605_to_oss():
    try:
        import oss2
        auth = oss2.Auth(OSS_ACCESS_KEY_ID, OSS_ACCESS_KEY_SECRET)
        endpoint = f"https://{OSS_REGION}.aliyuncs.com"
        bucket = oss2.Bucket(auth, endpoint, OSS_BUCKET)

        output_dir = Path("output")
        if output_dir.exists():
            files = [f for f in output_dir.iterdir() if f.is_file() and not f.name.startswith(".")]
            print(f"在 output 目录找到 {len(files)} 个报告/产物文件，准备同步至 OSS {OSS_BUCKET} -> {OSS_PATH_PREFIX}/reports/ ...")
            for f in files:
                object_key = f"{OSS_PATH_PREFIX}/reports/{f.name}"
                bucket.put_object_from_file(object_key, str(f))
                print(f"[✓] FTH1605 报告文件上传成功: {object_key}")
    except Exception as e:
        print(f"[OSS Error] 上传失败: {e}")

if __name__ == "__main__":
    sync_fth1605_to_oss()
