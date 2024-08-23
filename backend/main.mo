import Text "mo:base/Text";

import Float "mo:base/Float";
import Debug "mo:base/Debug";

actor Calculator {
  public func calculate(operation: Text, num1: Float, num2: Float) : async Float {
    switch (operation) {
      case ("add") { return num1 + num2; };
      case ("subtract") { return num1 - num2; };
      case ("multiply") { return num1 * num2; };
      case ("divide") {
        if (num2 == 0) {
          Debug.trap("Division by zero");
        };
        return num1 / num2;
      };
      case (_) {
        Debug.trap("Invalid operation");
      };
    };
  };
}