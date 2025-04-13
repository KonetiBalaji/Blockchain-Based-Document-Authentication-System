import React, { useEffect, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const PdfPreview = ({ ipfsUrl }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const loadPDF = async () => {
      const loadingTask = pdfjsLib.getDocument(ipfsUrl);
      const pdf = await loadingTask.promise;
      const page = await pdf.getPage(1);

      const scale = 1.5;
      const viewport = page.getViewport({ scale });

      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({ canvasContext: context, viewport }).promise;
    };

    if (ipfsUrl) loadPDF();
  }, [ipfsUrl]);

  return (
    <div className="my-4">
      <h3 className="text-md font-semibold mb-2 text-gray-700">📄 PDF Preview (Page 1)</h3>
      <canvas ref={canvasRef} className="shadow-md rounded border" />
    </div>
  );
};

export default PdfPreview;
