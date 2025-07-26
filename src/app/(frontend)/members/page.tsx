import { MainLayout } from "@/components/layout";

export default function Members() {
  return (
    <MainLayout sidebar="members">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-4">Faculty Members</h1>
        </div>
        
        <div className="space-y-6">
          {/* Example faculty member */}
          <div className="border rounded-lg p-6">
            <div className="flex gap-6">
              <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center">
                <span className="text-muted-foreground">Photo</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-blue-600 mb-2">Lei Xu</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Professor, Department of Computer Science and Engineering, Shanghai Jiao Tong University.
                </p>
                <p className="text-sm">
                  <strong>Research Interests:</strong> STATISTICAL LEARNING (unsupervised, supervised, unified theory, model 
                  selection) and applications to neural computing, financial engineering & time series, signal 
                  separation, bioinformatics; COMPUTER VISION (Random Hough Transform, detection of 
                  shape and motion of multiple objects).
                </p>
              </div>
            </div>
          </div>
          
          {/* Add more faculty members as needed */}
          <div className="border rounded-lg p-6">
            <div className="flex gap-6">
              <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center">
                <span className="text-muted-foreground">Photo</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-blue-600 mb-2">Baoliang Lu</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Professor, Department of Computer Science and Engineering, Shanghai Jiao Tong University.
                </p>
                <p className="text-sm">
                  <strong>Research Interests:</strong> Brain-like Computing, Neural Networks, Machine Learning, 
                  Brain-Computer Interface, Affective Computing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}