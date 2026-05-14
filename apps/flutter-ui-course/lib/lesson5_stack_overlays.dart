import 'package:flutter/material.dart';

class StackOverlaysScreen extends StatelessWidget {
  const StackOverlaysScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Lesson 5: Stack & Overlays')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Image with Badge', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            const SizedBox(height: 16),
            _buildExampleSection('Profile with Online Badge', _ImageWithBadge()),
            _buildExampleSection('Notification Badge', _NotificationBadge()),
            const Divider(height: 32),
            const Text('Text Overlays', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            const SizedBox(height: 16),
            _buildExampleSection('Image with Text Overlay', _ImageWithTextOverlay()),
            _buildExampleSection('Gradient Overlay', _GradientOverlay()),
            const Divider(height: 32),
            const Text('Positioning Patterns', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            const SizedBox(height: 16),
            _buildExampleSection('Bottom CTA Button', _BottomCTA()),
            _buildExampleSection('Corner Actions', _CornerActions()),
            const Divider(height: 32),
            const Text('User Avatar States', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            const SizedBox(height: 16),
            _buildExampleSection('Avatar with Status', _UserAvatarStates()),
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

class _ImageWithBadge extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 120,
      height: 120,
      child: Stack(
        children: [
          Container(
            decoration: BoxDecoration(color: Colors.blue.shade300, borderRadius: BorderRadius.circular(12)),
            child: const Center(child: Icon(Icons.person, size: 60, color: Colors.white)),
          ),
          Positioned(
            right: 8,
            bottom: 8,
            child: Container(
              width: 24,
              height: 24,
              decoration: BoxDecoration(
                color: Colors.green,
                shape: BoxShape.circle,
                border: Border.all(color: Colors.white, width: 2),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _NotificationBadge extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      color: Colors.grey.shade200,
      padding: const EdgeInsets.all(20),
      child: Stack(
        clipBehavior: Clip.none,
        children: [
          const Icon(Icons.notifications, size: 40),
          Positioned(
            right: -8,
            top: -8,
            child: Container(
              padding: const EdgeInsets.all(6),
              decoration: const BoxDecoration(color: Colors.red, shape: BoxShape.circle),
              child: const Text('3', style: TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold)),
            ),
          ),
        ],
      ),
    );
  }
}

class _ImageWithTextOverlay extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 200,
      height: 120,
      child: Stack(
        children: [
          Container(
            decoration: BoxDecoration(color: Colors.purple.shade300, borderRadius: BorderRadius.circular(12)),
            child: const Center(child: Icon(Icons.image, size: 50, color: Colors.white)),
          ),
          const Positioned(
            bottom: 8,
            left: 8,
            right: 8,
            child: Text('Summer Sale', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold), textAlign: TextAlign.center),
          ),
        ],
      ),
    );
  }
}

class _GradientOverlay extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 200,
      height: 120,
      child: Stack(
        children: [
          Container(
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(12),
              gradient: LinearGradient(begin: Alignment.topCenter, end: Alignment.bottomCenter, colors: [Colors.blue.shade300, Colors.purple.shade300]),
            ),
            child: const Center(child: Icon(Icons.photo, size: 50, color: Colors.white30)),
          ),
          Positioned.fill(
            child: Container(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(12),
                gradient: LinearGradient(begin: Alignment.topCenter, end: Alignment.bottomCenter, colors: [Colors.transparent, Colors.black.withValues(alpha: 0.7)]),
              ),
            ),
          ),
          const Positioned(bottom: 12, left: 12, child: Text('Photo Title', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16))),
        ],
      ),
    );
  }
}

class _BottomCTA extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      height: 120,
      child: Stack(
        children: [
          Container(color: Colors.grey.shade300, alignment: Alignment.center, child: const Text('Content behind CTA')),
          Positioned(
            bottom: 16,
            left: 16,
            right: 16,
            child: ElevatedButton(
              onPressed: () {},
              style: ElevatedButton.styleFrom(backgroundColor: Colors.blue, padding: const EdgeInsets.symmetric(vertical: 16)),
              child: const Text('Add to Cart - \$29.99', style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
            ),
          ),
        ],
      ),
    );
  }
}

class _CornerActions extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      width: 200,
      height: 150,
      color: Colors.grey.shade300,
      child: Stack(
        children: [
          const Center(child: Icon(Icons.image, size: 50)),
          Positioned(top: 8, right: 8, child: Container(padding: const EdgeInsets.all(4), decoration: const BoxDecoration(color: Colors.black54, shape: BoxShape.circle), child: const Icon(Icons.close, size: 16, color: Colors.white))),
          Positioned(top: 8, left: 8, child: Container(padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4), decoration: BoxDecoration(color: Colors.orange, borderRadius: BorderRadius.circular(4)), child: const Text('FEATURED', style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)))),
          Positioned(bottom: 8, right: 8, child: Container(padding: const EdgeInsets.all(8), decoration: const BoxDecoration(color: Colors.white, shape: BoxShape.circle), child: const Icon(Icons.favorite, size: 20, color: Colors.red))),
        ],
      ),
    );
  }
}

class _UserAvatarStates extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Wrap(spacing: 16, runSpacing: 16, children: const [
      _AvatarState(icon: Icons.person, status: Colors.green, size: 24),
      _AvatarState(icon: Icons.person, status: Colors.orange, size: 24),
      _AvatarState(icon: Icons.person, status: Colors.red, size: 24),
      _AvatarState(icon: Icons.person, status: Colors.grey, size: 24),
    ]);
  }
}

class _AvatarState extends StatelessWidget {
  final IconData icon;
  final Color status;
  final double size;

  const _AvatarState({required this.icon, required this.status, required this.size});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 60,
      height: 60,
      child: Stack(
        children: [
          Container(decoration: const BoxDecoration(color: Colors.blue, shape: BoxShape.circle), child: Center(child: Icon(icon, color: Colors.white, size: size))),
          Positioned(
            right: 0,
            bottom: 0,
            child: Container(width: 16, height: 16, decoration: BoxDecoration(color: status, shape: BoxShape.circle, border: Border.all(color: Colors.white, width: 2))),
          ),
        ],
      ),
    );
  }
}