import { MainLayout } from "@/components/layout";

export default function Resources() {
  return (
    <MainLayout sidebar="resources">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-4">Data Sets</h1>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full border border-border">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Size</th>
                <th className="text-left p-3">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-3">
                  <div>
                    <div className="font-medium">parallelcorpus.zh-vi.zip</div>
                    <a href="#" className="text-blue-600 hover:underline text-sm">(Download)</a>
                  </div>
                </td>
                <td className="p-3">1.2MB</td>
                <td className="p-3">Chinese-Vietname parallel corpus used for training machine translation model.</td>
              </tr>
              <tr className="border-b">
                <td className="p-3">
                  <div>
                    <div className="font-medium">EEGDataset.rar</div>
                    <a href="#" className="text-blue-600 hover:underline text-sm">(Download)</a>
                  </div>
                </td>
                <td className="p-3">458MB</td>
                <td className="p-3">Data set for single trial 64-channels EEG classification in BCI</td>
              </tr>
              <tr className="border-b">
                <td className="p-3">
                  <div>
                    <div className="font-medium">SEED_Dataset.rar</div>
                    <a href="#" className="text-blue-600 hover:underline text-sm">(Download)</a>
                  </div>
                </td>
                <td className="p-3">10.8GB</td>
                <td className="p-3">A dataset for emotion recognition using EEG signals</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-4">Tutorial & Courses</h2>
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-blue-600 mb-2">
                [COURSE]A Gentle Introduction to Programming Using Python (By Hai Zhao)
              </h3>
              <p className="text-sm text-muted-foreground">
                This course will provide a gentle, yet intense, introduction to programming using Python 
                for highly motivated students with little or no prior experience in programming. The course 
                will focus on planning and organizing programs, as well as the grammar of the Python 
                programming language.
              </p>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-blue-600 mb-2">
                [COURSE]Statistic Learning Course
              </h3>
              <p className="text-sm text-muted-foreground">
                The class introduces the theory and algorithms of computational learning in the framework 
                of statistics and functional analysis. It gives an in-depth discussion of state of the art 
                machine learning algorithms, for regression and classification, variable selection, manifold 
                learning and transfer learning.
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}