import * as tf from '@tensorflow/tfjs';
import type { Student } from './types';

let model: tf.LayersModel | null = null;

export async function loadModel(): Promise<void> {
  if (model) {
    return;
  }
  try {
    const modelUrl = '/model/model.json';
    model = await tf.loadLayersModel(modelUrl);
    console.log('TensorFlow.js model loaded successfully.');
  } catch (error) {
    console.error('Error loading TensorFlow.js model:', error);
    throw new Error('Could not load the ML model. Please check the console for details.');
  }
}

// Normalize features to a 0-1 scale based on assumed maximums.
// Adjust these values based on your model's training data.
function preprocess(features: number[]): number[] {
  const maxValues = [100, 40, 100, 100, 100, 100]; // Corresponds to feature order
  return features.map((feature, i) => feature / maxValues[i]);
}

export async function runInference(studentData: Omit<Student, 'id' | 'createdAt'>): Promise<number> {
  if (!model) {
    await loadModel();
  }
  if (!model) {
    throw new Error('Model is not loaded.');
  }

  const features: number[] = [
    studentData.attendancePercent,
    studentData.studyHoursPerWeek,
    studentData.previousMarks,
    studentData.assignmentsScore,
    studentData.participationScore,
    studentData.extraCurricularScore,
  ];

  const normalizedFeatures = preprocess(features);
  
  const inputTensor = tf.tensor2d([normalizedFeatures]);

  try {
    const prediction = model.predict(inputTensor) as tf.Tensor;
    const riskScore = (await prediction.data())[0];
    return riskScore;
  } finally {
    tf.dispose(inputTensor);
  }
}
