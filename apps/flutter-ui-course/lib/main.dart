import 'package:flutter/material.dart';
import 'lesson1_core_layouts.dart';
import 'lesson2_lists_grids.dart';
import 'lesson3_sliver_appbar.dart';
import 'lesson4_food_delivery.dart';
import 'lesson5_stack_overlays.dart';
import 'lesson6_food_delivery_clone.dart';

void main() {
  runApp(const FlutterUICourse());
}

class FlutterUICourse extends StatelessWidget {
  const FlutterUICourse({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter UI Course',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      home: const HomeScreen(),
    );
  }
}

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Flutter UI Course'),
        backgroundColor: Colors.deepPurple,
        foregroundColor: Colors.white,
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _buildLessonCard(
            context,
            'Lesson 1: Core Layouts',
            'Container, Row, Column, Stack basics',
            Icons.view_comfy_alt,
            1,
          ),
          _buildLessonCard(
            context,
            'Lesson 2: Lists & Grids',
            'ListView, GridView, Horizontal scrolling',
            Icons.list,
            2,
          ),
          _buildLessonCard(
            context,
            'Lesson 3: SliverAppBar',
            'Collapsing headers, CustomScrollView',
            Icons.vertical_align_top,
            3,
          ),
          _buildLessonCard(
            context,
            'Lesson 4: Food Delivery UI',
            'Real app clone with cards & overlays',
            Icons.fastfood,
            4,
          ),
          _buildLessonCard(
            context,
            'Lesson 5: Stack & Overlays',
            'Image overlays, badges, positioning',
            Icons.layers,
            5,
          ),
          _buildLessonCard(
            context,
            'Lesson 6: Food Delivery Clone',
            'Zomato-style dark UI with gradient header',
            Icons.restaurant_menu,
            6,
          ),
        ],
      ),
    );
  }

  Widget _buildLessonCard(
    BuildContext context,
    String title,
    String subtitle,
    IconData icon,
    int number,
  ) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      elevation: 2,
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: Colors.deepPurple,
          child: Text('$number', style: const TextStyle(color: Colors.white)),
        ),
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold)),
        subtitle: Text(subtitle),
        trailing: Icon(icon, color: Colors.deepPurple),
        onTap: () => _navigateToLesson(context, number),
      ),
    );
  }

  void _navigateToLesson(BuildContext context, int number) {
    Widget? screen;
    switch (number) {
      case 1:
        screen = const CoreLayoutsScreen();
        break;
      case 2:
        screen = const ListsGridsScreen();
        break;
      case 3:
        screen = const SliverAppBarScreen();
        break;
      case 4:
        screen = const FoodDeliveryScreen();
        break;
      case 5:
        screen = const StackOverlaysScreen();
        break;
      case 6:
        screen = const FoodDeliveryClone();
        break;
    }
    if (screen != null) {
      Navigator.push(context, MaterialPageRoute(builder: (_) => screen!));
    }
  }
}
