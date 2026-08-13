import AppKit
import PDFKit
import Vision

guard CommandLine.arguments.count >= 2 else {
    fputs("usage: ocr_pdf.swift <pdf-or-image-directory>\n", stderr)
    exit(1)
}

let url = URL(fileURLWithPath: CommandLine.arguments[1])
var isDirectory: ObjCBool = false
if FileManager.default.fileExists(atPath: url.path, isDirectory: &isDirectory), isDirectory.boolValue {
    let files = (try? FileManager.default.contentsOfDirectory(
        at: url,
        includingPropertiesForKeys: nil
    )) ?? []
    for (pageIndex, imageURL) in files.filter({
        ["png", "jpg", "jpeg"].contains($0.pathExtension.lowercased())
    }).sorted(by: { $0.lastPathComponent < $1.lastPathComponent }).enumerated() {
        guard let source = NSImage(contentsOf: imageURL) else { continue }
        var imageRect = NSRect(origin: .zero, size: source.size)
        guard let image = source.cgImage(forProposedRect: &imageRect, context: nil, hints: nil) else {
            continue
        }
        let request = VNRecognizeTextRequest()
        request.recognitionLevel = .accurate
        request.recognitionLanguages = ["zh-Hans", "en-US"]
        request.usesLanguageCorrection = true
        try? VNImageRequestHandler(cgImage: image, options: [:]).perform([request])
        print("\n===== PAGE \(pageIndex + 1) =====")
        for observation in (request.results ?? []).sorted(by: {
            if abs($0.boundingBox.midY - $1.boundingBox.midY) > 0.015 {
                return $0.boundingBox.midY > $1.boundingBox.midY
            }
            return $0.boundingBox.minX < $1.boundingBox.minX
        }) {
            if let candidate = observation.topCandidates(1).first {
                print(candidate.string)
            }
        }
    }
    exit(0)
}

guard let document = PDFDocument(url: url) else {
    fputs("cannot open pdf\n", stderr)
    exit(2)
}

for pageIndex in 0..<document.pageCount {
    guard let page = document.page(at: pageIndex) else { continue }
    let bounds = page.bounds(for: .mediaBox)
    let thumbnail = page.thumbnail(
        of: NSSize(width: bounds.width * 2.2, height: bounds.height * 2.2),
        for: .mediaBox
    )
    var imageRect = NSRect(origin: .zero, size: thumbnail.size)
    guard let image = thumbnail.cgImage(forProposedRect: &imageRect, context: nil, hints: nil) else {
        continue
    }
    let request = VNRecognizeTextRequest()
    request.recognitionLevel = .accurate
    request.recognitionLanguages = ["zh-Hans", "en-US"]
    request.usesLanguageCorrection = true
    let handler = VNImageRequestHandler(cgImage: image, options: [:])
    try? handler.perform([request])

    print("\n===== PAGE \(pageIndex + 1) =====")
    let observations = request.results ?? []
    for observation in observations.sorted(by: {
        if abs($0.boundingBox.midY - $1.boundingBox.midY) > 0.015 {
            return $0.boundingBox.midY > $1.boundingBox.midY
        }
        return $0.boundingBox.minX < $1.boundingBox.minX
    }) {
        if let candidate = observation.topCandidates(1).first {
            print(candidate.string)
        }
    }
}
