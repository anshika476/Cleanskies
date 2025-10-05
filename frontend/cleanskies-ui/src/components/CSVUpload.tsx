import React, { useState } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { parseCSV, processAirQualityData, AirQualityData } from '../lib/csvUtils';

interface CSVUploadProps {
  onDataLoaded: (data: any[]) => void;
}

const CSVUpload: React.FC<CSVUploadProps> = ({ onDataLoaded }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [uploadedCount, setUploadedCount] = useState(0);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      setUploadStatus('error');
      setErrorMessage('Please upload a CSV file');
      return;
    }

    setIsUploading(true);
    setUploadStatus('idle');

    try {
      const text = await file.text();
      const rawData = parseCSV(text);
      
      if (rawData.length === 0) {
        throw new Error('No data found in CSV file');
      }

      const processedData = processAirQualityData(rawData);
      setUploadedCount(processedData.length);
      setUploadStatus('success');
      onDataLoaded(processedData);
      
    } catch (error) {
      setUploadStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to parse CSV file');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <FileText className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Upload Air Quality Data</h3>
      </div>
      
      <p className="text-muted-foreground mb-4">
        Upload a CSV file containing air quality data with columns for city, zip code, and pollutant values.
      </p>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
            id="csv-upload"
            disabled={isUploading}
          />
          <label htmlFor="csv-upload">
            <Button
              asChild
              variant="outline"
              className="cursor-pointer"
              disabled={isUploading}
            >
              <span>
                <Upload className="h-4 w-4 mr-2" />
                {isUploading ? 'Uploading...' : 'Choose CSV File'}
              </span>
            </Button>
          </label>
        </div>

        {uploadStatus === 'success' && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Successfully loaded {uploadedCount} air quality records from CSV file.
            </AlertDescription>
          </Alert>
        )}

        {uploadStatus === 'error' && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {errorMessage}
            </AlertDescription>
          </Alert>
        )}

        <div className="text-sm text-muted-foreground">
          <p className="font-medium mb-2">Expected CSV format:</p>
          <div className="bg-muted p-3 rounded text-xs font-mono">
            city,zip_code,pm2.5,pm10,ozone,no2,temperature,humidity,wind_speed
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CSVUpload;
