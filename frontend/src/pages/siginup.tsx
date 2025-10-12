import { Input } from "../components/Input";
import { Button } from "../components/Button";







export function Signup() {
  return (
    <div className="h-screen w-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white rounded-lg border shadow-sm min-w-[320px] p-6">
        <h2 className="text-xl font-semibold text-center text-gray-800 mb-4 items-center">
          Signup
        </h2>

        <Input placeholder="Username" /><br/><br/>
        <Input placeholder="Password" />

        <div className="flex justify-center pt-4">
          <Button variant="primary" text="Signup" fullWidth />
        </div>
      </div>
    </div>
  );
}
