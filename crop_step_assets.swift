import Cocoa
import CoreGraphics
import Foundation

let srcPath = "/Users/wzq/.gemini/antigravity/brain/d51cbb03-4db8-4237-ade8-f974d6bc4d34/.user_uploaded/media_1786695974145.png"
let outDir = "/Users/wzq/Desktop/project/feifan/ceping/public/assets/images"

guard let image = NSImage(contentsOfFile: srcPath),
      let tiffData = image.tiffRepresentation,
      let bitmap = NSBitmapImageRep(data: tiffData),
      let cgImage = bitmap.cgImage else {
    print("Failed to load source image")
    exit(1)
}

let width = cgImage.width
let height = cgImage.height
print("Source dimensions: \(width)x\(height)")

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
        for i in 0..<(destW * destH) {
            let offset = i * 4
            let r = Double(buffer[offset])
            let g = Double(buffer[offset + 1])
            let b = Double(buffer[offset + 2])
            
            if r > 240 && g > 240 && b > 235 {
                let minVal = min(r, min(g, b))
                if minVal > 248 {
                    buffer[offset + 3] = 0
                } else {
                    let alpha = UInt8(max(0, min(255, (255.0 - minVal) * 36.0)))
                    buffer[offset + 3] = alpha
                }
            }
        }
    }
    
    guard let finalCGImage = context.makeImage() else { return }
    let finalRep = NSBitmapImageRep(cgImage: finalCGImage)
    guard let pngData = finalRep.representation(using: .png, properties: [:]) else { return }
    
    let outUrl = URL(fileURLWithPath: "\(outDir)/\(name).png")
    try? pngData.write(to: outUrl)
    print("Saved \(name).png (\(destW)x\(destH))")
}

// In media_1786695974145.png (dimensions 1024 x 1500 or similar):
// 1. 3D ID Profile card at top of Basic Info: x ~ 500..650, y ~ 110..220
// 2. Owl mascot with pencil in sidebar: x ~ 35..165, y ~ 400..500

// Let's crop:
cropAndSave(x: 505, y: 110, w: 140, h: 110, name: "icon-id-card", makeTransparent: true)
cropAndSave(x: 40, y: 400, w: 125, h: 105, name: "mascot-pencil-owl", makeTransparent: true)

print("Finished cropping additional assets!")
