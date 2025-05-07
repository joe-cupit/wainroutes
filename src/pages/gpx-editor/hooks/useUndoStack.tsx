import { useState } from "react"
import { GPXPoint } from "./useOpenGpx";


export default function useUndoStack() {

  const [undoStack, setUndoStack] = useState<GPXPoint[][]>([]);
  const [redoStack, setRedoStack] = useState<GPXPoint[][]>([]);


  const pushToUndoStack = (newItem: GPXPoint[]) => {
    setRedoStack([]);
    setUndoStack(prev => [...prev, newItem]);    
  }

  const popFromUndoStack = (currentState: GPXPoint[]) => {
    if (undoStack.length === 0) return;

    let prevStack = [...undoStack];
    let popped = prevStack.pop();
    setUndoStack(prevStack);
    setRedoStack(prev => [...prev, [...currentState]]);
    return popped;
  }

  const popFromRedoStack = (currentState: GPXPoint[]) => {
    if (redoStack.length === 0) return;

    let prevStack = [...redoStack];
    let popped = prevStack.pop();
    setRedoStack(prevStack);
    setUndoStack(prev => [...prev, [...currentState]]);
    return popped;
  }

  const resetUndoStack = () => {
    setUndoStack([]);
    setRedoStack([]);
  }

  return {
    undoSize: undoStack.length,
    redoSize: redoStack.length,
    undo: popFromUndoStack,
    redo: popFromRedoStack,
    push: pushToUndoStack,
    reset: resetUndoStack
  }
}