import Cocoa
import CoreGraphics
import Foundation

let srcPath = "/Users/wzq/.gemini/antigravity/brain/d51cbb03-4db8-4237-ade8-f974d6bc4d34/.user_uploaded/media_1786695509328.png"
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

// Function to crop and save
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
        // Find white/near-white background and make transparent
        for i in 0..<(destW * destH) {
            let offset = i * 4
            let r = Double(buffer[offset])
            let g = Double(buffer[offset + 1])
            let b = Double(buffer[offset + 2])
            
            // Check if it's white or nearly white background (r > 245, g > 245, b > 245)
            if r > 240 && g > 240 && b > 240 {
                // calculate alpha falloff
                let minVal = min(r, min(g, b))
                if minVal > 250 {
                    buffer[offset + 3] = 0 // completely transparent
                } else {
                    let alpha = UInt8(max(0, min(255, (255.0 - minVal) * 25.5)))
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

// Bounding box estimations based on 1024x682 layout in media_1786695509328.png:
// Top row:
// 1. Logo: x: 30, y: 190, w: 190, h: 190 (Note: CG coordinates y starts at top or bottom depending on context. CGImage.cropping has (0,0) at top-left)
// Let's crop:
// Logo: x ~ 40, y ~ 180, w ~ 180, h ~ 180
// Hero Podium: x ~ 230, y ~ 30, w ~ 470, h ~ 370
// Owl Mascot: x ~ 730, y ~ 130, w ~ 250, h ~ 270

// Middle row:
// Timer: x ~ 40, y ~ 360, w ~ 130, h ~ 160
// Paper Pencil: x ~ 210, y ~ 375, w ~ 130, h ~ 150
// Lightbulb: x ~ 370, y ~ 380, w ~ 100, h ~ 140
// Shield Check: x ~ 525, y ~ 380, w ~ 120, h ~ 140
// Padlock: x ~ 680, y ~ 380, w ~ 110, h ~ 140
// Check Circle: x ~ 830, y ~ 380, w ~ 120, h ~ 140

// Bottom row:
// Star: x ~ 40, y ~ 535, w ~ 85, h ~ 90
// Sphere: x ~ 165, y ~ 540, w ~ 90, h ~ 85
// Drop: x ~ 290, y ~ 540, w ~ 65, h ~ 85
// Bubble: x ~ 395, y ~ 540, w ~ 90, h ~ 85
// Pill Card: x ~ 525, y ~ 540, w ~ 130, h ~ 85
// Graph Card: x ~ 680, y ~ 540, w ~ 120, h ~ 85
// Bar Card: x ~ 820, y ~ 540, w ~ 145, h ~ 85

cropAndSave(x: 40, y: 190, w: 180, h: 180, name: "feifan-logo", makeTransparent: false)
cropAndSave(x: 235, y: 30, w: 460, h: 360, name: "hero-podium", makeTransparent: true)
cropAndSave(x: 740, y: 130, w: 235, h: 260, name: "mascot-owl", makeTransparent: true)

cropAndSave(x: 45, y: 365, w: 125, h: 155, name: "icon-timer", makeTransparent: true)
cropAndSave(x: 215, y: 380, w: 120, h: 140, name: "icon-paper-pencil", makeTransparent: true)
cropAndSave(x: 375, y: 380, w: 90, h: 140, name: "icon-bulb", makeTransparent: true)
cropAndSave(x: 525, y: 380, w: 120, h: 140, name: "icon-shield-check", makeTransparent: true)
cropAndSave(x: 680, y: 380, w: 110, h: 140, name: "icon-lock", makeTransparent: true)
cropAndSave(x: 830, y: 380, w: 120, h: 140, name: "icon-check-circle", makeTransparent: true)

cropAndSave(x: 40, y: 535, w: 85, h: 90, name: "float-star", makeTransparent: true)
cropAndSave(x: 165, y: 540, w: 90, h: 85, name: "float-sphere", makeTransparent: true)
cropAndSave(x: 290, y: 540, w: 65, h: 85, name: "float-drop", makeTransparent: true)
cropAndSave(x: 395, y: 540, w: 90, h: 85, name: "float-bubble", makeTransparent: true)
cropAndSave(x: 525, y: 540, w: 130, h: 85, name: "float-pill-card", makeTransparent: true)
cropAndSave(x: 680, y: 540, w: 120, h: 85, name: "float-graph-card", makeTransparent: true)
cropAndSave(x: 820, y: 540, w: 145, h: 85, name: "float-bar-card", makeTransparent: true)

print("All assets cropped successfully!")
