import { MainLayout } from "@/components/layout";

export default function Home() {
  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Hero Section - Placeholder for future hero carousel */}
        <section className="text-center py-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
          <h1 className="text-4xl font-bold mb-4">Welcome to the BCMI Laboratory!</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Center for Brain-like Computing and Machine Intelligence
          </p>
        </section>
        
        {/* About Section */}
        <section className="prose prose-lg max-w-none">
          <p>
            Center for Brain-like Computing and Machine Intelligence is founded by Prof. Bao-Liang Lu and 
            Prof. Liqing Zhang. The long term mission of the center is to understand the mechanism of 
            intelligent information processing and cognitive process in the brain and to develop new type 
            computing structures and algorithms for information technology.
          </p>
          <p>
            To this end, by means of advanced EEG equipment and system modeling technology, we are to 
            develop new type models for neural information presentation, feature analysis and pattern 
            recognition. Current research interests include Brain Computer Interface, Computer Vision, 
            Speech Signal Processing, Natural Language Processing, Bioinformatics, Machine Learning and 
            Cognitive Computing.
          </p>
        </section>
        
        {/* Contact Information */}
        <section className="bg-muted/50 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
          <div className="space-y-2">
            <p><strong>Telephone:</strong> +86(21)34204421</p>
            <p><strong>Address:</strong> 3-East 307 SEIEE Building, No. 800 Dongchuan Road, Minhang District, Shanghai, 200240</p>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
