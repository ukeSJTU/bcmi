import { MainLayout } from "@/components/layout";

export default function Research() {
  return (
    <MainLayout sidebar="research">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-4">Brain Computer Interface and EEG Data Processing</h1>
          <p className="text-muted-foreground mb-6">
            By using theory and methods of statistical learning and information geometry, such as PCA/ICA, 
            NMF, NTF (Nonnegative Tensor Factorization), we are
          </p>
        </div>
        
        <div className="space-y-4">
          <ul className="list-disc list-inside space-y-2">
            <li>To investigate EEG noise reduction, event-related potentials, pattern analysis for imaginary motion evoked potentials and vigilance pattern analysis.</li>
            <li>To study the spatial-temporal characteristics of evoked potentials and their dynamics.</li>
            <li>To develop pattern classification methods for evoked potentials, imaginary motion potentials and vigilance</li>
            <li>To design EEG based vigilance analysis system and brain-computer interaction systems</li>
          </ul>
        </div>
        
        <div>
          <h3 className="text-xl font-semibold mb-4">Demos:</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2">EEG-based Wheelchair</h4>
              <p className="text-sm text-muted-foreground">
                Demonstration of brain-computer interface technology for wheelchair control
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2">Multi-person Car Racing System</h4>
              <p className="text-sm text-muted-foreground">
                Interactive brain-controlled racing system for multiple participants
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}