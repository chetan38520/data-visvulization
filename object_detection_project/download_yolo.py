import urllib.request
import os

def download_yolo_files():
    yolo_dir = 'yolo_files'
    if not os.path.exists(yolo_dir):
        os.makedirs(yolo_dir)
    
    files = {
        'yolov3.cfg': 'https://raw.githubusercontent.com/pjreddie/darknet/master/cfg/yolov3.cfg',
        'coco.names': 'https://raw.githubusercontent.com/pjreddie/darknet/master/data/coco.names',
    }
    
    print("Downloading YOLO files...")
    
    for filename, url in files.items():
        filepath = os.path.join(yolo_dir, filename)
        
        if os.path.exists(filepath):
            print(f"{filename} already exists")
            continue
        
        print(f"Downloading {filename}...")
        try:
            urllib.request.urlretrieve(url, filepath)
            print(f"Downloaded {filename}")
        except Exception as e:
            print(f"Failed to download {filename}: {e}")
    
    print("Note: yolov3.weights (248MB) needs to be downloaded manually")
    print("Download from: https://pjreddie.com/media/files/yolov3.weights")
    print(f"Place it in the '{yolo_dir}' folder")

if __name__ == "__main__":
    download_yolo_files()
