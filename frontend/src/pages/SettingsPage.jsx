import { useThemeStore } from "../store/useThemeStore";
import { Sun, Moon, ChevronDown } from "lucide-react";

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="h-screen container mx-auto px-4 pt-20 max-w-5xl">
      <div className="space-y-6">
        <h2 className="text-lg font-semibold">Appearance</h2>
        
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-medium">Change Theme</h3>
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="btn btn-ghost flex items-center justify-between w-40 px-4 py-2 border rounded-lg"
          >
            <div className="flex items-center gap-2">
              {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
              <span className="text-sm">{theme === "light" ? "Dark" : "Light"} Mode</span>
            </div>
            <ChevronDown size={16} />
          </button>
        </div>

        <h3 className="text-lg font-semibold mb-3">Preview</h3>
        <div className="rounded-xl border border-base-300 overflow-hidden bg-base-100 shadow-lg">
          <div className="p-4 bg-base-200">
            <div className="max-w-lg mx-auto">
              <div className="bg-base-100 rounded-xl shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-base-300 bg-base-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-content font-medium">
                      J
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">John Doe</h3>
                      <p className="text-xs text-base-content/70">Online</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 space-y-4 min-h-[200px] max-h-[200px] overflow-y-auto bg-base-100">
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-xl p-3 shadow-sm bg-base-200">
                      <p className="text-sm">Hey! How's it going?</p>
                      <p className="text-[10px] mt-1.5 text-base-content/70">12:00 PM</p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="max-w-[80%] rounded-xl p-3 shadow-sm bg-primary text-primary-content">
                      <p className="text-sm">I'm doing great! Just working on some new features.</p>
                      <p className="text-[10px] mt-1.5 text-primary-content/70">12:00 PM</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t border-base-300 bg-base-100">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="input input-bordered flex-1 text-sm h-10"
                      placeholder="Type a message..."
                      value="This is a preview"
                      readOnly
                    />
                    <button className="btn btn-primary h-10 min-h-0">
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;