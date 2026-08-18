import Cocoa
import CoreGraphics
import Foundation

let srcPath = "/Users/wzq/.gemini/antigravity/brain/d51cbb03-4db8-4237-ade8-f974d6bc4d34/.user_uploaded/media_1786697066375.png"
let outDirs = [
    "/Users/wzq/Desktop/project/feifan/ceping/public/assets/images",
    "/Users/wzq/Desktop/project/feifan/ceping/src/assets/images"
]

guard let image = NSImage(contentsOfFile: srcPath),
      let tiffData = image.tiffRepresentation,
      let bitmap = NSBitmapImageRep(data: tiffData),
      let cgImage = bitmap.cgImage else {
    print("Failed to load source image")
    exit(1)
}

let width = cgImage.width
let height = cgImage.height
print("media_1786697066375 dimensions: \(width)x\(height)")

func cropAndSave(x: Int, y: Int, w: Int, h: Int, name: String, makeTransparent: Bool = true) {
    let cropRect = CGRect(x: x, y: y, width: w, height: h)
    guard let cropped = cgImage.cropping(to: cropRect) else {
        print("Failed to crop \(name)")
        return
    }
    
    let destW = cropped.width
    let destH = cropped.height
    
    let colorSpace = CGColorSpaceCreateDeviceRGB()
    let bitmapInfo = CGImageAlphaInfo.premultipliedLast.rawValue
    guard let context = CGContext(data: nil, width: destW, height: destH, bitsPerComponent: 8, bytesPerRow: destW * 4, space: colorSpace, bitmapInfo: bitmapInfo) else {
        print("Failed to create context for \(name)")
        return
    }
    
    context.draw(cropped, in: CGRect(x: 0, y: 0, width: destW, height: destH))
    guard let pixelData = context.data else { return }
    let buffer = pixelData.bindMemory(to: UInt8.self, capacity: destW * destH * 4)
    
    if makeTransparent {
        let bgR = Double(buffer[0])
        let bgG = Double(buffer[1])
        let bgB = Double(buffer[2])
        
        for i in 0..<(destW * destH) {
            let offset = i * 4
            let r = Double(buffer[offset])
            let g = Double(buffer[offset + 1])
            let b = Double(buffer[offset + 2])
            
            let diff = abs(r - bgR) + abs(g - bgG) + abs(b - bgB)
            if (r > 240 && g > 240 && b > 235) || diff < 18.0 {
                buffer[offset + 3] = 0
            } else if diff < 38.0 {
                let alpha = UInt8((diff / 38.0) * 255.0)
                buffer[offset + 3] = alpha
            }
        }
    }
    
    guard let finalCGImage = context.makeImage() else { return }
    let finalRep = NSBitmapImageRep(cgImage: finalCGImage)
    guard let pngData = finalRep.representation(using: .png, properties: [:]) else { return }
    
    for dir in outDirs {
        let outUrl = URL(fileURLWithPath: "\(dir)/\(name).png")
        try? pngData.write(to: outUrl)
    }
    print("Saved \(name).png (\(destW)x\(destH))")
}

// Extract Report Assets
cropAndSave(x: 205, y: 40, w: 135, h: 160, name: "mascot-magnifier-owl")
cropAndSave(x: 410, y: 40, w: 360, h: 160, name: "report-hero-visual")
cropAndSave(x: 410, y: 40, w: 145, h: 160, name: "report-folder-chart")

cropAndSave(x: 305, y: 360, w: 100, h: 90, name: "icon-vark-visual")
cropAndSave(x: 495, y: 355, w: 85, h: 100, name: "icon-vark-auditory")
cropAndSave(x: 680, y: 355, w: 85, h: 100, name: "icon-vark-readwrite")
cropAndSave(x: 845, y: 355, w: 85, h: 100, name: "icon-vark-kinesthetic")

cropAndSave(x: 720, y: 510, w: 90, h: 110, name: "icon-magnifier-glass")
cropAndSave(x: 835, y: 500, w: 110, h: 135, name: "icon-report-doc")

print("All report assets extracted successfully!")
