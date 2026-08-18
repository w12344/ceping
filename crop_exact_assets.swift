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
print("media_1786695974145 dimensions: \(width)x\(height)")

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
        // Sample corner color as background reference
        let bgR = Double(buffer[0])
        let bgG = Double(buffer[1])
        let bgB = Double(buffer[2])
        
        for i in 0..<(destW * destH) {
            let offset = i * 4
            let r = Double(buffer[offset])
            let g = Double(buffer[offset + 1])
            let b = Double(buffer[offset + 2])
            
            // Distance from light warm background
            let diff = abs(r - bgR) + abs(g - bgG) + abs(b - bgB)
            if (r > 240 && g > 240 && b > 230) || diff < 15.0 {
                buffer[offset + 3] = 0
            } else if diff < 35.0 {
                let alpha = UInt8((diff / 35.0) * 255.0)
                buffer[offset + 3] = alpha
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

// In media_1786695974145.png (dimensions: 682x1024):
// In the PC side (left half, x: 0..460):
// Top header "基本信息" is at x ~ 155, y ~ 110..180
// The 3D ID card on the PC side is at: x: 350..425, y: 110..180
// In the Mobile side (right half, x: 480..682):
// The 3D ID card on mobile is at: x: 595..660, y: 140..190

// Let's also check the sidebar owl on PC side (x: 20..130, y: 400..500):
// Sidebar card is at x: 22..125, y: 100..500
// Owl is at x: 32..115, y: 405..495

cropAndSave(x: 352, y: 112, w: 75, h: 75, name: "icon-id-card", makeTransparent: true)
cropAndSave(x: 32, y: 405, w: 82, h: 88, name: "mascot-pencil-owl", makeTransparent: true)

print("Exact bounding boxes cropped successfully!")
