import 'package:flutter/material.dart';

class CoreLayoutsScreen extends StatelessWidget {
  const CoreLayoutsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Lesson 1: Core Layouts'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Container',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            const Text('The most versatile widget - box, padding, margin, color'),
            const SizedBox(height: 16),
            _buildExampleSection(
              'Basic Container',
              Container(
                height: 100,
                width: double.infinity,
                color: Colors.blue.shade100,
                alignment: Alignment.center,
                child: const Text('Container with alignment'),
              ),
            ),
            _buildExampleSection(
              'Container + Decoration',
              Container(
                height: 100,
                width: double.infinity,
                decoration: BoxDecoration(
                  color: Colors.blue.shade200,
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: const [
                    BoxShadow(
                      color: Colors.black26,
                      blurRadius: 8,
                      offset: Offset(0, 4),
                    ),
                  ],
                ),
                alignment: Alignment.center,
                child: const Text('Rounded + Shadow'),
              ),
            ),
            const Divider(height: 32),
            const Text(
              'Row & Column',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            const Text('Main axis = direction of children flow'),
            const SizedBox(height: 16),
            _buildExampleSection(
              'Row (Horizontal)',
              Container(
                height: 80,
                width: double.infinity,
                color: Colors.grey.shade200,
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    Container(color: Colors.red, width: 40, height: 40),
                    Container(color: Colors.green, width: 40, height: 40),
                    Container(color: Colors.blue, width: 40, height: 40),
                  ],
                ),
              ),
            ),
            _buildExampleSection(
              'Column (Vertical)',
              Container(
                height: 150,
                width: double.infinity,
                color: Colors.grey.shade200,
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    Container(color: Colors.red, width: 40, height: 40),
                    Container(color: Colors.green, width: 40, height: 40),
                    Container(color: Colors.blue, width: 40, height: 40),
                  ],
                ),
              ),
            ),
            const Divider(height: 32),
            const Text(
              'Expanded & Flexible',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            const Text('Fill remaining space - used inside Row/Column/Flex'),
            const SizedBox(height: 16),
            _buildExampleSection(
              'Expanded (fills with fixed ratio)',
              Container(
                height: 60,
                width: double.infinity,
                color: Colors.grey.shade200,
                child: Row(
                  children: [
                    Container(color: Colors.red, width: 40),
                    const Expanded(
                      flex: 1,
                      child: ColoredBox(color: Colors.green),
                    ),
                    Container(color: Colors.blue, width: 40),
                  ],
                ),
              ),
            ),
            _buildExampleSection(
              'Flexible (can shrink if needed)',
              Container(
                height: 60,
                width: double.infinity,
                color: Colors.grey.shade200,
                child: Row(
                  children: [
                    const Flexible(
                      flex: 1,
                      fit: FlexFit.loose,
                      child: ColoredBox(color: Colors.orange),
                    ),
                    Container(color: Colors.purple, width: 100),
                  ],
                ),
              ),
            ),
            const Divider(height: 32),
            const Text(
              'Stack & Positioned',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            const Text('Layer widgets on top of each other'),
            const SizedBox(height: 16),
            _buildExampleSection(
              'Stack (layering)',
              Container(
                height: 120,
                width: double.infinity,
                color: Colors.grey.shade200,
                child: Stack(
                  children: [
                    Container(color: Colors.red.shade300, width: 100, height: 100),
                    Positioned(
                      right: 10,
                      bottom: 10,
                      child: Container(
                        color: Colors.blue.shade300,
                        width: 60,
                        height: 60,
                      ),
                    ),
                    const Positioned(
                      top: 20,
                      left: 20,
                      child: Text('Overlay Text'),
                    ),
                  ],
                ),
              ),
            ),
            _buildExampleSection(
              'Align (relative positioning)',
              Container(
                height: 100,
                width: double.infinity,
                color: Colors.grey.shade200,
                child: Stack(
                  children: [
                    Container(color: Colors.teal, width: 80, height: 80),
                    const Align(
                      alignment: Alignment.bottomRight,
                      child: SizedBox(
                        width: 40,
                        height: 40,
                        child: ColoredBox(color: Colors.amber),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 100),
          ],
        ),
      ),
    );
  }

  Widget _buildExampleSection(String title, Widget example) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(title, style: const TextStyle(fontWeight: FontWeight.w500)),
        const SizedBox(height: 8),
        example,
        const SizedBox(height: 16),
      ],
    );
  }
}