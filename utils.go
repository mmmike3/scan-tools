package main

import (
	"bytes"
	"fmt"
	"image/jpeg"
	"strings"

	"unicode"
	"unsafe"

	"github.com/boombuler/barcode"
	"github.com/boombuler/barcode/code128"
	ps "github.com/mitchellh/go-ps"
	"github.com/skip2/go-qrcode"
	"golang.org/x/sys/windows"
)


const (
    PROCESS_VM_READ  = 0x0010
    PROCESS_QUERY_INFORMATION = 0x0400
)

// convertString2QRCodeImage generates a QR code image from a string and returns it as a byte buffer
func convertString2QRCodeImage(code string) (*bytes.Buffer, error) {
    qr, err := qrcode.New(code, qrcode.Medium)
    if err != nil {
        return nil, err
    }

    img := qr.Image(256)
    buffer := new(bytes.Buffer)
    err = jpeg.Encode(buffer, img, nil)
    if err != nil {
        return nil, err
    }

    return buffer, nil
}

// convertString2BarCodeImage generates a barcode image from a string and returns it as a byte buffer
func convertString2BarCodeImage(code string) (*bytes.Buffer, error) {
    barCode, err := code128.Encode(code)
    if err != nil {
        return nil, err
    }

    // Scale the barcode to 256x256 pixels
    scaledBarCode, err := barcode.Scale(barCode, 256, 256)
    if err != nil {
        return nil, err
    }
    barCode = scaledBarCode.(barcode.BarcodeIntCS)

    buffer := new(bytes.Buffer)
    err = jpeg.Encode(buffer, barCode, nil)
    if err != nil {
        return nil, err
    }

    return buffer, nil
}

func findRootWXWebProcess() (int, error) {
	processList, err := ps.Processes()
	if err != nil {
		return 0, err
	}
	for _, process := range processList {
		if process.Executable() == "WXWorkWeb.exe" {
			pp, err := ps.FindProcess(process.PPid())
			if err != nil {
				return 0, err
			}
			if pp.Executable() == "WXWork.exe" {
				return process.Pid(), nil
			}
		}
	}
	return 0, nil
}

func searchMemory(pid int, searchString string) (string, error) {
    handle, err := windows.OpenProcess(PROCESS_VM_READ|PROCESS_QUERY_INFORMATION, false, uint32(pid))
    if err != nil {
        return "", fmt.Errorf("无法打开进程: %v", err)
    }
    defer windows.CloseHandle(handle)

    var memInfo windows.MemoryBasicInformation
    address := uintptr(0)

    for {
        ret := windows.VirtualQueryEx(handle, address, &memInfo, unsafe.Sizeof(memInfo))
        if ret != nil {
			break
        }

        if memInfo.State == windows.MEM_COMMIT && memInfo.Protect == windows.PAGE_READWRITE {
            buffer := make([]byte, memInfo.RegionSize)
            var bytesRead uintptr
            err := windows.ReadProcessMemory(handle, address, &buffer[0], uintptr(len(buffer)), &bytesRead)
            if err == nil {
                if idx := strings.Index(string(buffer), searchString); idx != -1 {
                    printableString := extractPrintableString(buffer[idx:])
					return printableString, nil
                }
            }
        }

        address += memInfo.RegionSize
    }

    return "", nil
}

func extractPrintableString(data []byte) string {
    var result []rune
    for _, b := range data {
        r := rune(b)
        if unicode.IsPrint(r) {
            result = append(result, r)
        } else {
            break
        }
    }
    return string(result)
}

func findCookieInWxWebProcess() (string, error) {
	wxWebRootPid, err := findRootWXWebProcess()
	if err != nil {
		return "", err
	}
	return searchMemory(wxWebRootPid, "INTEL_AUTH_TOKEN_V2_SWEEP")
}

func main() {
	cookie, err := findCookieInWxWebProcess()
	if err != nil {
		fmt.Println("Error:", err)
	} else {
		fmt.Println("Cookie:", cookie)
	}
}