import { describe, expect, test } from "bun:test"
import { completedToolUpdate } from "../../src/acp/tool"

const update = (uri: string) =>
  completedToolUpdate({
    toolCallId: "call-1",
    toolName: "screenshot",
    input: {},
    content: [{ type: "file", uri, mime: "image/png", name: "image.png" }],
    cwd: "/tmp",
  })

describe("ACP tool content", () => {
  test("turns base64 image data URLs into image content", () => {
    expect(update("data:image/png;name=a.png;base64,AAAA").content).toEqual([
      { type: "content", content: { type: "image", mimeType: "image/png", data: "AAAA" } },
    ])
  })

  test("drops file parts that are not base64 image data URLs", () => {
    expect(update("data:image/png,raw").content).toEqual([])
    expect(update("data:text/plain;base64,aGk=").content).toEqual([])
  })

  // A run of ';' with no ';base64,' used to backtrack exponentially (seconds per call on V8).
  test("rejects a long run of semicolons in linear time", () => {
    const started = performance.now()
    expect(update("data:image/png" + ";".repeat(5000) + "x").content).toEqual([])
    expect(performance.now() - started).toBeLessThan(50)
  })
})
