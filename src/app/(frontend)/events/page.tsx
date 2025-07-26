import { MainLayout } from "@/components/layout";

export default function Events() {
  return (
    <MainLayout sidebar="events">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-4">Upcoming Events</h1>
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-4">Coming Conference</h2>
          <div className="overflow-x-auto">
            <table className="w-full border border-border">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3">Conference Name</th>
                  <th className="text-left p-3">Deadline</th>
                  <th className="text-left p-3">Website</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-3">ACL short</td>
                  <td className="p-3">2014-3-12</td>
                  <td className="p-3">
                    <a href="http://www.cs.jhu.edu/ACL2014/" className="text-blue-600 hover:underline">
                      http://www.cs.jhu.edu/ACL2014/
                    </a>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-3">Coling</td>
                  <td className="p-3">2014-3-21</td>
                  <td className="p-3">
                    <a href="http://www.coling-2014.org/important-dates.php" className="text-blue-600 hover:underline">
                      http://www.coling-2014.org/important-dates.php
                    </a>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-3">EMNLP</td>
                  <td className="p-3">2014-6-2</td>
                  <td className="p-3">
                    <a href="http://emnlp2014.org/" className="text-blue-600 hover:underline">
                      http://emnlp2014.org/
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-4">Past Events</h2>
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <div className="flex gap-4 mb-2">
                <div className="text-center bg-muted p-2 rounded">
                  <div className="text-sm font-semibold">2013-07</div>
                  <div className="text-2xl font-bold">22</div>
                  <div className="text-xs">Monday</div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-blue-600 mb-2">Dragon Star Program 2013</h3>
                  <p className="text-sm text-muted-foreground">
                    This one-week, short-term course covers computational models and algorithms for auditory 
                    perception and processing. Topics include auditory scene analysis, pitch analysis, sound 
                    localization, speech and music processing...
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}