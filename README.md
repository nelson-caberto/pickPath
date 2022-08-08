# pickPath

[https://nelson-caberto.github.io/pickPath/](https://nelson-caberto.github.io/pickPath/)

## Background

A friend works at a warehouse and was tasked to optimize routes for traversing the aisles via Excel and manually creating upwards of single column 70,000 row csv files by manipulating then copying and pasting pre formatted columns. This task averaged 1-2 weeks per floor. I wanted to help speed that up and help reduce errors.

## Description

Using a predefined aisle order, generate a list of the aisle's bins and concatinate them to create a single CSV file.

## Usage
  
1. Define
  * Floor Name
  * Starting Aisle Number
  * Ending Aisle Number
  * Bin Start - Starting Bin Number
  * Bin Offset - Number to skip to start each Bin Segment
  * Bin Segment - Number of Bin Segments
  * Bin Count - Number of Bins per Segment
  * Direction - the arrows define the direction of Aisle traversal
2. Generate the Layout
3. Select the Order for traversing the Aisle's/Bin's by clicking on the X to give a order number
4. Download the CSV
